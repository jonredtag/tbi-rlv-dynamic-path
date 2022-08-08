<?php
namespace App\Helper;

class Helpers {
    static function getClientIp(){
        $ip = '209.29.115.170';
        if (getenv('HTTP_INCAP_CLIENT_IP')) {
            $ip = getenv('HTTP_INCAP_CLIENT_IP');
        } elseif (getenv('HTTP_X_FORWARDED_FOR_OLD')) {
            $ip = getenv('HTTP_X_FORWARDED_FOR_OLD');
        } elseif (getenv('HTTP_X_REAL_IP')) {
            $ip = getenv('HTTP_X_REAL_IP');
        } elseif (getenv('HTTP_CLIENT_IP')) {
            $ip = getenv('HTTP_CLIENT_IP');
        // } elseif (getenv('HTTP_X_FORWARDED_FOR')) {
        //     $ip = getenv('HTTP_X_FORWARDED_FOR');
        } elseif (getenv('HTTP_X_FORWARDED')) {
            $ip = getenv('HTTP_X_FORWARDED');
        } elseif (getenv('HTTP_FORWARDED_FOR')) {
            $ip = getenv('HTTP_FORWARDED_FOR');
        } elseif (getenv('HTTP_FORWARDED')) {
            $ip = getenv('HTTP_FORWARDED');
        } else {
            $ip = $_SERVER['REMOTE_ADDR'];
        }
        return $ip;
    }
    
    static function getCardType($number){
        $number =  trim($number);
        $firtLetter = substr($number, 0,1);
        $cardType = null;
        switch($firtLetter){
            case '3':
                $cardType = 'AX';
                break;
            
            case '4':
                $cardType = 'VI';
                 break;
            
            case '5':
                 $cardType = 'MC';
                break;
        }
        return $cardType;
    }
    
    static function getCardTypeAndName($number){
        $number =  trim($number);
        $cardTypeNum = substr($number, 0,1);
        $cardTypeCode = '';
        $cardTypeName = '';
        if($cardTypeNum === '4') {
            $cardTypeCode = 'VI';
             $cardTypeName = 'Visa';
        } else if ($cardTypeNum === '5') {
            $cardTypeCode = 'MC';
            $cardTypeName = 'Mastercard';
        } else if ($cardTypeNum === '3') {
            $cardTypeCode = 'AX';
            $cardTypeName = 'American Express';
        }
        return [$cardTypeCode,$cardTypeName];
    }
    
    static function getAge($bithdayDate)
    {
        $date = new \DateTime($bithdayDate);
        $now = new \DateTime();
        $interval = $now->diff($date);
        return $interval->y;
    }
    
    public static function cacheSet($key, $variable, $addIp = true, $time = 3600) {
            $ip_addr = '';
            if($addIp) $ip_addr = self::getClientIp();
            if (class_exists("Memcache", false)) {
                    $memcached_obj = new \Memcache();
                    $memcached_obj->addServer(defined('MEMCACHE_SERVER')?MEMCACHE_SERVER:"mc.redtag.ca", 11211);  
                    return $memcached_obj->set($key.$ip_addr, $variable, MEMCACHE_COMPRESSED, $time);
            } else {
                    if(!session_id()) @session_start();
                    $_SESSION[$key.$ip_addr] = $variable;
            }
            return;
    }

    // Load response from memcache
    public static function cacheGet($key, $addIp = true) {
            $ip_addr = '';
            if($addIp) $ip_addr = self::getClientIp();
            if (class_exists("Memcache", false)) {
                    $memcached_obj = new \Memcache();
                    $memcached_obj->addServer(defined('MEMCACHE_SERVER')?MEMCACHE_SERVER:"mc.redtag.ca", 11211);
                    return $memcached_obj->get($key.$ip_addr);
            } else {
                    if(!session_id()) @session_start();
                    return (isset($_SESSION[$key.$ip_addr])) ? $_SESSION[$key.$ip_addr]: null;
            }
    }    
}
