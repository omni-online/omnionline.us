<?php 

$config = json_decode(rtrim(substr(file_get_contents('../config.js'), 17), ';'));

require('../vendor/autoload.php');
use Mailgun\Mailgun;

$mg = new Mailgun($config->mailgun->api);

header('Content-Type: application/json');
if(!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
    if ($_POST && $_POST['email']) {
        
        $mg->sendMessage($config->mailgun->smtp, array(
            'from' => 'sandbox@'.$config->mailgun->smtp, 
            'to'      => implode(', ', $config->mailgun->emails), 
            'subject' => 'Contact form', 
            'text'    => implode(' - ', $_POST)
        ));
            
        // success
        ?>{}<?php
        
    } else {
        header('HTTP/1.0 403 Forbidden');
        ?>{message: "Email is required"}<?php
    }
} else {
    header('HTTP/1.0 403 Forbidden');
} ?>