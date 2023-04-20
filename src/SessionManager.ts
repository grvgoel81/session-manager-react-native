(process as any).browser = true;

import log from "loglevel";
import {encryptData, decryptData, keccak256 } from '@toruslabs/metadata-helpers';
import { generatePrivate, getPublic, sign } from "@toruslabs/eccrypto";
import { SessionManagerApi } from "./api/Web3AuthApi";
import type { SecureStore } from "./types/IExpoSecureStore";
import type { EncryptedStorage } from "./types/IEncryptedStorage";
import KeyStore from "./session/KeyStore";

class SessionManager {
    keyStore: KeyStore;
    sessionId: string;
    sessionTime: number;

    constructor(sessionId: string, storage: SecureStore|EncryptedStorage, sessionTime: number) {
        this.sessionId = sessionId;    
        this.keyStore = new KeyStore(storage);
        this.sessionTime = sessionTime;
    }

    async createSession(data: string): Promise<boolean> {
        var result = false; 
        const sessionId = generatePrivate().toString("hex").padStart(64, "0");
        if (sessionId && sessionId.length > 0) {
          var pubKey = getPublic(Buffer.from(sessionId, "hex")).toString("hex");
          var privKey = Buffer.from(this.sessionId, "hex");
          var encData = await encryptData(this.sessionId, data);
          var signature = (await sign(privKey, keccak256(encData))).toString("hex");
          
          try {
            await SessionManagerApi.createSession({
              key: pubKey,
              data: encData,
              signature,
              timeout: this.sessionTime
            });
            result = true;
          } catch (ex) {
            result = false; 
            log.error(ex);
            throw new Error("Something went wrong!");
          }
        }
        return result;
      }

    async authorizeSession(): Promise<string> {
        const sessionId = await this.keyStore.get("sessionId");
        if (sessionId && sessionId.length > 0) {
         var pubKey = getPublic(Buffer.from(sessionId, "hex")).toString("hex");
         var result = await SessionManagerApi.authorizeSession(pubKey);
         if (!result.message) {
            throw new Error("Session Expired or Invalid public key");
          }
         
         var response = await decryptData<any>(sessionId, result.message);   
   
         if (response.error) {
          throw new Error(`session recovery failed with error ${response.error}`);
         }
        }
       return Promise.resolve(response)
     }
   
     async invalidateSession(): Promise<boolean> {
       var result = false; 
       const sessionId = await this.keyStore.get("sessionId");
       if (sessionId && sessionId.length > 0) {
         var pubKey = getPublic(Buffer.from(sessionId, "hex")).toString("hex");
         var privKey = Buffer.from(this.sessionId, "hex");
         var encData = await encryptData(this.sessionId, {});
         var signature = (await sign(privKey, keccak256(encData))).toString("hex");
         
         try {
           await SessionManagerApi.invalidateSession({
             key: pubKey,
             data: encData,
             signature,
             timeout: 1
           });
   
           this.keyStore.remove("sessionId")
           result = true;
         } catch (ex) {
           result = false; 
           log.error(ex);
           throw new Error("Something went wrong!");
         }
       }
       return result;
     }  
}

export default SessionManager;