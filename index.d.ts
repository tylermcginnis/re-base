import firebase = require('firebase');


/**
 *
 */
interface RebaseConfiguration {
    /**
     * Your firebase API key
     */
    apiKey : string;

    /**
     * Your firebase auth domain
     */
    authDomain : string

    /**
     * Your firebase database root URL
     */
    databaseURL : string

    /**
     * Your firebase storage bucket
     */
    storageBucket? :string

    /**
     * Your firebase messaging sender id
     */
    messagingSenderId? : string
}

declare module "rebase" {
   function createClass(configuration: RebaseConfiguration, type= '[DEFAULT]'): void;
}