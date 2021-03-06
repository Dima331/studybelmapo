<?php
	$host= "localhost";
	$user = "studybelmapo";
	$passwd = "C7v4E0d1";
	$dbname = "study";

	const CONNECTIONS = array(
		"CourseId" => "cources",
		"ResidPlace" => "residence",
		"FormEduc" => "formofeducation",
		"Status" => "status",
		"PersonId" => "personal_card",
		"Arrival_id" => "arrivals_zip",
		"Person_id" => "personal_card",
		"facultId" => "faculties",
		"FacultId" => "faculties",
		"Cathedra" => "cathedras",
		"CathedrId" => "cathedras",
		"cathedraId" => "cathedras",
		"TypePreparId" => "formofeducation",
		"EducType" => "eductype",
		"type" => "eductype",
		"userId" => "users",
		"personId" => "personal_card",
		"Cathedra" => "cathedras",
		"country" => "countries",
		"region" => "regions",
		"district" => "bel_districts",
		"sovet" => "bel_sovets",
		"tip" => "bel_city_type",
		"MarkId" => "marks",
		"Faculty" => "faculties",
		"ee" => "personal_establishment",
		"establishmentId" => "personal_establishment",
		"citizenship" => "countries",
		"cityzenship" => "countries",
		"appointment" => "personal_appointment",
		"qualification_add" => "qualification_add",
		"qualification_main" => "qualification_main",
		"qualification_other" => "qualification_other",
		"organization" => "personal_organizations",
		"speciality_doct" => "speciality_doct",
		"speciality_retraining" => "speciality_retraining",
		"speciality_other" => "speciality_other",
		"department" => "personal_department",
		"faculty" => "personal_faculty"
	);

	const LABELS = array(
		"ResidPlace" => "Место жительства",
		"FormEduc" => "Форма обучения",
		"Status" => "Статус",
		"Cathedra" => "Кафедра",
		"EducType" => "Тип обучения",
		"country" => "Страна",
		"region" => "Регион",
		"district" => "Область",
		"sovet" => "Исполком",
		"tip" => "Тип населённого пункта",
		"Faculty" => "Факультет",
		"ee" => "Учебное заведение",
		"establishmentId" => "Учебное заведение",
		"citizenship" => "Гражданство",
		"cityzenship" => "Гражданство",
		"tel_number_mobile" => "Мобильный тел.",
		"appointment" => "Должность",
		"qualification_add" => "Квалификация (доп.)",
		"qualification_main" => "Квалификация (осн.)",
		"qualification_other" => "Квалификация (др.)",
		"organization" => "Место работы",
		"speciality_doct" => "Специальность (врач.)",
		"speciality_retraining" => "Специальность (переподг.)",
		"speciality_other" => "Специальность (др.)",
		"department" => "Отдел",
		"faculty" => "Факультет",
		"Dic_count" => "Номер договора"
	);

	function broadcastUpdate($info, $mysqli){
		$query = "SELECT id FROM users";
		$obj = $mysqli->query("SELECT id FROM users");
		while ($row = $obj->fetch_assoc()) {
			$userId = $row["id"];
			$insert = "INSERT INTO `updateList`(`info`, `userId`) VALUES ('$info', $userId)";
			$mysqli->query($insert) or die ("Error in '$insert': " . mysqli_error($mysqli));
		}
	}

	function checkUpdate($userId, $mysqli){
		$query = "SELECT * FROM updateList WHERE userId = $userId";
		$result = $mysqli->query($query) or die ("Error in '$query': " . mysqli_error($mysqli));

		$response = array();

		while($row = $result->fetch_assoc()){
			array_push($response, $row);
		}
		return json_encode($response);
	}

	function deleteUpdate($userId, $info, $mysqli){
		$query = "DELETE FROM updateList WHERE userId = $userId AND info LIKE '$info'";
		$result = $mysqli->query($query) or die ("Error in '$query': " . mysqli_error($mysqli));
	}
?>