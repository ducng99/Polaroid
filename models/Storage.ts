import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GenerateRandomString } from '../utils';
import CryptoES from 'crypto-es';

export default class Storage {
    private static _instance?: Storage;
    private static get Instance() {
        if (!Storage._instance) {
            Storage._instance = new Storage();
        }

        return Storage._instance;
    }
    
    private IsInitialized = false;
    
    private readonly PASSPHRASE_KEY = 'storagePassphrase';
    private passphrase: string|null = null;
    
    private constructor() {}
    
    private async init() {
        if (!this.IsInitialized) {
            this.passphrase = await SecureStore.getItemAsync(this.PASSPHRASE_KEY);
            
            if (!this.passphrase) {
                this.passphrase = GenerateRandomString();
                await SecureStore.setItemAsync(this.PASSPHRASE_KEY, this.passphrase);
            }
            
            this.IsInitialized = true;
        }
    }
    
    static async get(key: string) {
        await this.Instance.init();
        
        try {
            const encrypted_value = await AsyncStorage.getItem(key);
            
            if (this.Instance.passphrase && encrypted_value) {
                return CryptoES.AES.decrypt(encrypted_value, this.Instance.passphrase).toString(CryptoES.enc.Utf8);
            }
        }
        catch (ex) {
            console.error(ex);
            throw new Error("Failed to retrieve data for key: " + key);
        }
    }
    
    static async set(key: string, value: string) {
        await this.Instance.init();
        
        try {            
            if (this.Instance.passphrase) {
                const encrypted_value = CryptoES.AES.encrypt(value, this.Instance.passphrase).toString();
                await AsyncStorage.setItem(key, encrypted_value);
            }
        }
        catch (ex) {
            console.error(ex);
            throw new Error("Failed to set data for key: " + key);
        }
    }
    
    static async remove(key: string) {
        await this.Instance.init();
        
        try {
            await AsyncStorage.removeItem(key);
        }
        catch (ex) {
            console.error(ex);
            throw new Error("Failed to remove data for key: " + key);
        }
    }
}