<?php
    $hostname = "localhost";
    $username = "esainnov_flap";
    $password = "GHemaOp12<3";
    $db = "esainnov_flap";
    
    $conn = mysqli_connect($hostname, $username, $password, $db);
    
    if (!$conn) {
        die ("Connection could not be established " . mysqli_connect_error());
    }
    
    $delete = "DELETE FROM user_token_list WHERE createdAt < (CURRENT_TIMESTAMP() - INTERVAL 12 HOUR);";
    
    if (mysqli_query($conn, $delete)) {
        echo "Successful";
    } else {
        echo "Unsuccessful";
    }
    
    mysqli_close($conn);
?>