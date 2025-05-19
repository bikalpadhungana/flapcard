<?php
    $hostname = "localhost";
    $username = "flaapme_flapcardnp";
    $password = "rzvqIZrv9L18E9F";
    $db = "flaapme_flapcardnp";
    
    $conn = mysqli_connect($hostname, $username, $password, $db);
    
    if (!$conn) {
        die ("Connection could not be established " . mysqli_connect_error());
    }
    
    $delete = "DELETE FROM user_token_list WHERE createdAt < (CURRENT_TIMESTAMP() - INTERVAL 1 DAY);";
    
    if (mysqli_query($conn, $delete)) {
        echo "Successful";
    } else {
        echo "Unsuccessful";
    }
    
    mysqli_close($conn);
?>