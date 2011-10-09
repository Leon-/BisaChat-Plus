<?php
function checkLogin($username, $password) {
	$username = preg_replace('[^A-Za-z0-9_\-\.]', '', $usernamme);
	
	if (file_exists('./login/'.$username)) {
		$data = unserialize(file_get_contents('./login/'.$username));
		
		if ($data['passwordHash'] === sha1(sha1($username.$data['salt']).sha1($password.$data['salt']))) {
			return true;
		}
		else {
			header('HTTP/1.0 401 Unauthorized');
			exit(0);
		}
	}
	else {
		header('HTTP/1.0 401 Unauthorized');
		exit(0);
	}
}
