<?php

namespace App\Services\Crypto;

class CryptoService {

    function __construct() {

    }

    public function encrypt($data)
    {
        $key = hash('sha256', "c3e30167f27c", true);

        $cipher = "aes-256-gcm";

        $ciphertext = '';

        if (in_array($cipher, openssl_get_cipher_methods()))
        {
            $ivlen = openssl_cipher_iv_length($cipher);
            $iv = openssl_random_pseudo_bytes($ivlen);
            $ciphertext = openssl_encrypt($data, $cipher, $key, 0, $iv, $tag);
            $ciphertext = $tag.$iv.$ciphertext;
        }

        return base64_encode($ciphertext);
    }

    public function decrypt($data)
    {
        $key = hash('sha256', "c3e30167f27c", true);
        $data = base64_decode($data);
        $cipher = "aes-256-gcm";
        $ciphertext = '';

        if (in_array($cipher, openssl_get_cipher_methods()))
        {
            $ivlen = openssl_cipher_iv_length($cipher);
            $tag = substr($data, 0, 16);
            $data = substr($data, 16);
            $iv = substr($data, 0, $ivlen);
            $data = substr($data, $ivlen);
            $ciphertext = openssl_decrypt($data, $cipher, $key, 0, $iv, $tag);
        }

        return $ciphertext;
    }
}
