import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PersonalDataService } from "./services/personalData.service";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { BsModalService, BsModalRef, TabsetComponent } from 'ngx-bootstrap';
import { listLocales } from 'ngx-bootstrap/bs-moment';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { PersonService } from './services/savePerson.service';
import  { Person } from "./model/person.class";
import { PreloaderComponent } from "./preloader.component";
import {NotificationsService} from 'angular4-notify';
import { ActivatedRoute, Router } from '@angular/router';
import { Retraining } from './model/profesionInfo.class';
@Component({
	templateUrl: "templates/addStudent.component.html",
	providers: [PersonalDataService, PersonService, BsModalService],
	styles: [`
		table tbody tr td{
			font-size:16px;
			color: #333;
			padding:5px;
		}
		small{
			color:#fa787e;
		}
		.input-group-addon{
			background-color:#c5c5c5;
		}
		.input-group-btn .btn{
			border-right-width:2px;
		}
		blockquote{
			border-left-color: #9368E9;
		}
		fieldset{
			padding:20px;
			margin-bottom:10px;
		}
		.tab-content{
			padding:20px;
		}
		tabset input, select{
			margin-bottom:10px;
		}
		.newValue{
			z-index:0;
		}
		.no-padding{
			padding:0px;
		}
		tabset input{
			margin:0px;
		}
		tabset .input-group{
			margin-top:10px;
		}
	`]
})

export class AddStudentComponent implements OnInit{
	@ViewChild("tabSet") tabSet: TabsetComponent
	@ViewChild("existTpl") exist: TemplateRef<any>;
	private personal_faculties: any[] = [];
	
	private personal_appointments: any[] = [];
	private personal_organizations: any[] = [];
	private personal_cityzenships: any[] = [];
	private personal_regions: any[] = [];
	private personal_cities:any[] = [];
	
	private personal_departments: any[] = [];
	private personal_establishments: any[] = [];
	private belmapo_courses:any[] = [];

	private selectedCourse:any;
	private faculties: any[] = [];
	private educTypes: any[] = [];
	private educForms: any[] = [];
	private residance: any[] = [];

	private specialityDocArr: any[] = [];
	private specialityRetrArr: any[] = [];
	private specialityOtherArr: any[] = [];
	private qualificationMainArr: any[] = [];
	private qualificationAddArr: any[] = [];
	private qualificationOtherArr: any[] = [];

	public newPerson:Person = new Person();
	public tempData:Person = new Person();
	public originalData:Person = new Person();
	private isLoaded: boolean = false;
	private isChecked:boolean = false;

	private outputData:any = {};
	private newValue: string = "";
	private fillDataModal: BsModalRef;
	bsValue: Date = new Date();
	minDate = new Date(1970, 1, 1);
  	maxDate = new Date();
  	locale = "ru";
  	courseId:number = 0;
  	bsConfig: Partial<BsDatepickerConfig> =  Object.assign({}, { containerClass: "theme-blue", locale: this.locale });
  	alreadyExist: BsModalRef;
  	activateTab: boolean = false;

	constructor(private dataService: PersonalDataService,
				private saveService: PersonService,
				private notify: NotificationsService,
				private router: ActivatedRoute,
				private routerNav: Router,
				private modal: BsModalService){}
	selectCourse(courseId:number){
		for (var course of this.belmapo_courses) {
			if(course.id === courseId){
				this.selectedCourse = course;
				break;
			}
		}
	}
	SavePerson(inputData:any): void{
 		if (inputData.personal.birthdayDate !== undefined) {
 			inputData.personal.birthday = inputData.personal.birthdayDate.toISOString().slice(0,10);
 		}
 		if (inputData.personal.pasportDate !== undefined) {
 			inputData.personal.pasport_date = inputData.personal.pasportDate.toISOString().slice(0,10);
 		}
 
 		if (inputData.profesional.diploma_startDate !== undefined) {
 			inputData.profesional.diploma_start = inputData.profesional.diploma_startDate.toISOString().slice(0,10);
 		}
 		if (inputData.profesional.mainCategoryDate !== undefined) {
 			inputData.profesional.mainCategory_date = inputData.profesional.mainCategoryDate.toISOString().slice(0,10);
 		}
 		if (inputData.profesional.addCategoryDate !== undefined) {
 			inputData.profesional.addCategory_date = inputData.profesional.addCategoryDate.toISOString().slice(0,10);
 		}
 		if (inputData.profesional.speciality_retraining_diploma_startDate !== undefined) {
 			inputData.profesional.speciality_retraining_diploma_start_date = inputData.profesional.speciality_retraining_diploma_startDate.toISOString().slice(0,10);
 		}
 		if (inputData.profesional.speciality_retraining.length > 0) {
 			for (var i = 0; i < inputData.profesional.speciality_retraining.length; i++) {
 				inputData.profesional.speciality_retraining[i].diploma_start = inputData.profesional.speciality_retraining[i].diploma_startDate.toISOString().slice(0,10);
 			}
 		}
 		if (inputData.sience.statusApproveDate !== undefined) {
 			inputData.sience.statusApprove_date = inputData.sience.statusApproveDate.toISOString().slice(0,10);
 		}
 		inputData.belmapo_course = this.courseId;
 		this.saveService.save(inputData).then(data => {
 			this.notify.addInfo("Cлушатель зачислен");
 			this.isChecked = false;
 			this.newPerson = new Person();
 			this.modal.hide(1);
 		});
 	}
	NextTab(tabId:number){
  		this.tabSet.tabs[tabId].active = true;
  	}
	DropdownList(data:any):string{
		return data.value;
	}
	fillLastInfo(template: TemplateRef<any>):void{
		this.fillDataModal = this.modal.show(template, {class: "modal-md"});
	}
	ngOnInit():void{
		this.courseId = this.router.snapshot.params["id"]
		this.dataService.getData().then(data => {
			this.faculties = data.json().facBel;
			this.educTypes = data.json().educTypeBel;
			this.educForms = data.json().formBel;
			this.residance = data.json().belmapo_residence;
			this.personal_faculties = data.json().facArr;
			this.personal_cityzenships = data.json().residArr;
			this.personal_appointments = data.json().appArr;
			this.personal_organizations = data.json().orgArr;
			this.personal_regions = data.json().regArr;
			this.personal_departments = data.json().depArr;
			this.personal_establishments = data.json().estArr;
			this.personal_cityzenships = data.json().residArr;
			this.belmapo_courses = data.json().coursesBel;
			this.specialityDocArr = data.json().specialityDocArr;
			this.specialityRetrArr = data.json().specialityRetrArr;
			this.specialityOtherArr = data.json().specialityOtherArr;
			this.qualificationMainArr = data.json().qualificationMainArr;
			this.qualificationAddArr = data.json().qualificationAddArr;
			this.qualificationOtherArr = data.json().qualificationOtherArr;
			this.personal_cities = data.json().citiesArr;
			this.isLoaded = true;
		});
	}
	saveNewParameter(value:string, table:string, array: any[]){
		this.outputData.value = value;
		this.outputData.table = table;

		switch (table){
			case "personal_establishment":{
				for (var i = this.personal_establishments.length - 1; i >= 0; i--) {
					if (this.personal_establishments[i].value == value) {
						this.notify.addWarning("Этот вариант уже существует");
						return;
					}
					
				}
				break;
			}
			case "countries":{
				for (var i = this.personal_cityzenships.length - 1; i >= 0; i--) {
					if (this.personal_cityzenships[i].value == value) {
						this.notify.addWarning("Этот вариант уже существует");
						return;
					}
					
				}
				break;
			}
			case "personal_appointment":{
				for (var i = this.personal_appointments.length - 1; i >= 0; i--) {
					if (this.personal_appointments[i].value == value) {
						this.notify.addWarning("Этот вариант уже существует");
						return;
					}
					
				}
				break;
			}
			case "personal_organizations":{
				for (var i = this.personal_organizations.length - 1; i >= 0; i--) {
					if (this.personal_organizations[i].value == value) {
						this.notify.addWarning("Этот вариант уже существует");
						return;
					}
					
				}
				break;
			}
			case "personal_department":{
				for (var i = this.personal_departments.length - 1; i >= 0; i--) {
					if (this.personal_departments[i].value == value) {
						this.notify.addWarning("Этот вариант уже существует");
						return;
					}
					
				}
				break;
			}
			case "personal_faculty":{
				for (var i = this.personal_faculties.length - 1; i >= 0; i--) {
					if (this.personal_faculties[i].value == value) {
						this.notify.addWarning("Этот вариант уже существует");
						return;
					}
					
				}
				break;
			}
		}

		this.saveService.saveParameter(this.outputData).then(data => {
			array.push(data.json());

			switch (table){
				case "personal_establishment":{
					this.newPerson.profesional.educational_establishment = data.id;
					break;
				}
				case "countries":{
					this.newPerson.personal.cityzenship = data.json().id;
					break;
				}
				case "personal_appointment":{
					this.newPerson.general.appointment = data.json().id;
					break;
				}
				case "personal_organizations":{
					this.newPerson.general.organization = data.json().id;
					break;
				}
				case "personal_department":{
					this.newPerson.general.department = data.json().id;
					break;
				}
				case "personal_faculty":{
					this.newPerson.profesional.faculty = data.json().id;
					break;
				}
			}
			this.newValue = "";
		})
	}
	AddRetraining(){
 		this.newPerson.profesional.speciality_retraining.push(new Retraining());
 	}
 	RemoveRetraining(){
 		this.newPerson.profesional.speciality_retraining.pop();	
 	}
	Check(){
		if (!this.isChecked) {
			this.dataService.check(this.newPerson).then(response => {
				// try{
				// 	this.tempData = Object.assign(new Person(), response.json());
				// 	if (this.tempData.profesional.addCategory_date !== undefined) {
				// 		this.tempData.profesional.addCategoryDate = new Date(this.tempData.profesional.addCategory_date);
				// 	}
				// 	if (this.tempData.profesional.mainCategory_date !== undefined) {
				// 		this.tempData.profesional.mainCategoryDate = new Date(this.tempData.profesional.mainCategory_date);
				// 	}
				// 	if (this.tempData.personal.pasport_date !== undefined) {
				// 		this.tempData.personal.pasportDate = new Date(this.tempData.personal.pasport_date);
				// 	}
				// 	if (this.tempData.profesional.diploma_start !== undefined) {
				// 		this.tempData.profesional.diploma_startDate = new Date(this.tempData.profesional.diploma_start);
				// 	}
				// 	if (this.tempData.personal.birthday !== undefined) {
				// 		this.tempData.personal.birthdayDate = new Date(this.tempData.personal.birthday);
				// 	}
				// 	if (this.tempData.profesional.speciality_retraining.length !== 0) {
				// 		for (var i = 0; i < this.tempData.profesional.speciality_retraining.length; i++) {
				// 			this.tempData.profesional.speciality_retraining[i].diploma_startDate = new Date(this.tempData.profesional.speciality_retraining[i].diploma_start);
				// 		}
				// 	}
				// 	this.alreadyExist = this.modal.show(this.exist, {class: "modal-md"});
				// }catch(e){
				// 	console.log(response._body);
				// 	this.tabSet.tabs.splice(0, 1);
				// }
				if (response._body == "Exist") {
					this.alreadyExist = this.modal.show(this.exist, {class: "modal-md"});
				}else if(response._body == "Not exist"){
					this.activateTab = true;
					setTimeout(() => {
						this.tabSet.tabs[1].active = true
					}, 200);
				}else{
					console.log(response._body);
				}
			});
		}
	}
	Confirm(){
		this.routerNav.navigate(['../../chooseStudent', this.courseId], {relativeTo: this.router});
		this.modal.hide(1);
	}
	Hide(){
		this.modal.hide(1);
  	}
}