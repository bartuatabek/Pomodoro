<?php
// Initialize the session
session_start();
 
// If session variable is not set it will redirect to login page
if(!isset($_SESSION['username']) || empty($_SESSION['username'])){
  header("location: login.php");
  exit;
}
?>
 
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Pomodoro Timer</title>
	<link rel="stylesheet" href="css/style.css">
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
	<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
</head>
<body>
	<div class="header">
		<a href="edit.php" class="edit" style="text-decoration: none; cursor:pointer;">Edit</a>
		<a href="logout.php" class="logout" style="text-decoration: none; cursor:pointer;">Logout</a>		
    </div>
	
	<h6>Hi, <b><?php echo htmlspecialchars($_SESSION['username']); ?></b>. Welcome to Pomodoro.</h6>

	<div class="macro-wrap">
		<p class="mode"></p>

		<div class="controls-wrap">
			<div class="controls">
			<h1 class="title pomodoro-length">Pomodoro Length</h1>
			<div class="button add pomodoro-length">
				<p class="button-value">+</p>
			</div>
		
			<p class="number-value"></p>
			<div class="button reduce pomodoro-length">
				<p class="button-value">-</p>
			</div>
			</div>
		
			<div class="controls">
			<h1 class="title short-break-length">Short Break Length</h1>
			<div class="button add short-break-length">
				<p class="button-value">+</p>
			</div>
		
			<p class="number-value"></p>
			<div class="button reduce short-break-length">
				<p class="button-value">-</p>
			</div>
			</div>
		
			<div class="controls">
			<h1 class="title long-break-length">Long Break Length</h1>
			<div class="button add long-break-length">
				<p class="button-value">+</p>
			</div>
		
			<p class="number-value"></p>
			<div class="button reduce long-break-length">
				<p class="button-value">-</p>
			</div>
			</div>
	</div>

	<div class="display-wrap">
		<p class="time"></p>
		<div class="buttons">
			<div class="reset">Reset</div>
			<div class="skip">Skip</div>
		</div>
	</div>

	<div class="session-history">
		<h1 class="session-history-title">Work Session History</h1>
		<!-- <p class="session-count"></p> -->
	</div>

		<div class="plot">
		<div class="filter-wrap">
			<input type="date" id="datepicker">
			<div class="filter">Filter</div>
		</div>
		<div id="chart_div"></div>
	</div>
</div>

<script type="text/javascript" src="js/main.js"></script>
</body>
</html>