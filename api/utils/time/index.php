<?php

header('Content-Type: application/json');

$config = json_decode(rtrim(substr(file_get_contents('../../../config.js'), 17), ';'));

function testBuild($agent, $build) {
    
    global $config;
    
    $start = strlen($config->apisecuritystring);

    return substr($agent, $start, strlen($build)) === $build;
}

function testAgent($agent) {
    
    global $config;
    
    foreach ($config->buildnumbers as $build) {
        if (testBuild($agent, $build)) {
            return true;
        }
    }
    
    return false;
}

function filterNonApps() {
    
    global $config;
    
    $headers = apache_request_headers();
    $userAgent = $headers['User-Agent'];
    
    if ($userAgent && strrpos($userAgent, $config->apisecuritystring) === 0) {
        if (testAgent($userAgent)) {
            return true;
        } else {
            echo '{"err": "Update"}';
            exit;
        }
    } else {
        header($_SERVER["SERVER_PROTOCOL"]." 404 Not Found");
        exit;
    }
}

if (filterNonApps()) {

    ?>{"seconds":<?php echo time(); ?>}<?php
    
    }
?>