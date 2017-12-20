<?php 
	ini_set("display_errors", 1);
	require_once("config.php");

	function getSqlObj($tableName, $mysqli){
		$result = $mysqli->query("SELECT id, name AS value FROM $tableName ORDER BY name ASC");
		return $result;
	}
	function getArray($SqlObj){
		$newArray = array();
		while ($row = $SqlObj->fetch_assoc()) {
			if ($row["id"] == 0) {
				continue;
			}
			array_push($newArray, $row);
		}
		return $newArray;
	}

	$mysqli = mysqli_connect($host, $user, $passwd, $dbname) or die ("Ошибка подключения: " . mysqli_connect_error());
	$mysqli->query("SET NAMES utf8");

	$estObj = getSqlObj("personal_establishment", $mysqli);
	$residObj = getSqlObj("countries", $mysqli);
	$appObj = getSqlObj("personal_appointment", $mysqli);
	$orgObj = getSqlObj("personal_organizations", $mysqli);
	$regObj = getSqlObj("regions", $mysqli);
	$belmapo_residenceObj = getSqlObj("Residence", $mysqli);
	$depObj = getSqlObj("personal_department", $mysqli);
	$facObj = getSqlObj("personal_faculty", $mysqli);

	$facBelMAPOObj = getSqlObj("faculties", $mysqli);
	$cathBelMAPOObj = getSqlObj("cathedras", $mysqli);
	$coursesBelMAPOObj = getSqlObj("cources", $mysqli);
	$formBelMAPOObj = getSqlObj("formofeducation", $mysqli);
	$educTypeBelMAPOObj = getSqlObj("educType", $mysqli);

	$specialityDocObj = getSqlObj("speciality_doct", $mysqli);
	$specialityRetrObj = getSqlObj("speciality_retraining", $mysqli);
	$specialityOtherObj = getSqlObj("speciality_other", $mysqli);

	$qualificationMainObj = getSqlObj("qualification_main", $mysqli);
	$qualificationAddObj = getSqlObj("qualification_add", $mysqli);
	$qualificationOtherObj = getSqlObj("qualification_other", $mysqli);

	$estArr = getArray($estObj);
	$residArr = getArray($residObj);
	$appArr = getArray($appObj);
	$orgArr = getArray($orgObj);
	$regArr = getArray($regObj);
	$belmapo_residenceArr = getArray($belmapo_residenceObj);
	$depArr = getArray($depObj);
	$facArr = getArray($facObj);

	$facBel = getArray($facBelMAPOObj);
	$cathBel = getArray($cathBelMAPOObj);
	$coursesBel = getArray($coursesBelMAPOObj);
	$formBel = getArray($formBelMAPOObj);
	$educTypeBel = getArray($educTypeBelMAPOObj);

	$specialityDocArr = getArray($specialityDocObj);
	$specialityRetrArr = getArray($specialityRetrObj);
	$specialityOtherArr = getArray($specialityOtherObj);

	$qualificationMainArr = getArray($qualificationMainObj);
	$qualificationAddArr = getArray($qualificationAddObj);
	$qualificationOtherArr = getArray($qualificationOtherObj);

	$response['estArr'] = $estArr;
	$response['residArr'] = $residArr;
	$response['appArr'] = $appArr;
	$response['orgArr'] = $orgArr;
	$response['regArr'] = $regArr;
	$response['depArr'] = $depArr;
	$response['facArr'] = $facArr;
	$response['belmapo_residence'] = $belmapo_residenceArr;

	$response['facBel'] = $facBel;
	$response['cathBel'] = $cathBel;
	$response['coursesBel'] = $coursesBel;
	$response['formBel'] = $formBel;
	$response['educTypeBel'] = $educTypeBel;

	$response['specialityDocArr'] = $specialityDocArr;
	$response['specialityRetrArr'] = $specialityRetrArr;
	$response['specialityOtherArr'] = $specialityOtherArr;
	$response['qualificationMainArr'] = $qualificationMainArr;
	$response['qualificationAddArr'] = $qualificationAddArr;
	$response['qualificationOtherArr'] = $qualificationOtherArr;
	echo json_encode($response);
?>