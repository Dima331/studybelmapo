import { Component, OnInit, ViewChild } from '@angular/core';
import { InfoService } from './studList.service';
import { AccordionModule, TabsetComponent } from 'ngx-bootstrap';
import { CurrentCourcesListService } from '../FillData/services/getCurrentCourcesList.service';
import { Course } from '../model/course.class';
import { Global } from '../model/global.class';
import { PersonalDataService } from '../personalInfo/personalData.service';
import {NotificationsService} from 'angular4-notify';
import { StudListService } from './stud-list.service';
import { LogService } from '../share/log.service';
import { IfObservable } from 'rxjs/observable/IfObservable';
import { ShareService } from '../share/share.service';

declare var $: any;
@Component({
	templateUrl: "./studList.component.html",
	providers: [InfoService, CurrentCourcesListService, PersonalDataService],
	styles:[`
		tr.active,
		tr.active>td{
			background-color:#15A3C1 !important;
			color:#fff;
		}
		tr.active .btn{
			border-color: #fff;
			color:#fff;
		}
		.nested:hover,
		.nested{
			background:#FFF !important;
		}
		[accordion-heading]:first-letter{
			text-transform: capitalize;
		}
		.pull-right{
			font-style:italic;
		}
		a:hover{
			cursor:pointer;
		}
		.refresh:hover{
			color: #666;
		}
	`]
})

export class StudListComponent implements OnInit{
	@ViewChild("courseLists") coursesTabs: TabsetComponent;
	courseList: any[] = [];
	oldCourses: any[] = [];
	currentCourses: any[] = [];
	futureCourses: any[] = [];
	prevRow: any;
	message:string = "";
	isLoading: boolean[] = new Array(4).fill(true);
	
	
	global: Global = new Global();
	types: any[] = [];
	currentUser: any;
	cathedraClass: string = "panel-default";
	deducts:number;
	ArchiveIsLoaded: boolean = false;
	archive: any[] = [];
	ArchiveYearIsLoaded: boolean = false;
	nowYear: number = new Date().getFullYear();
	shouldUpdateList: boolean = false;
	constructor(private info: InfoService,
				private getList: CurrentCourcesListService,
				private dataSrv: PersonalDataService,
				private notify: NotificationsService,
				private share: ShareService,
				private students: StudListService,
				private log: LogService){}

	ngOnInit(): void{
		this.share._updateData.subscribe(list => {
			for(let item of list){
				if(item.info == "studList"){
					this.shouldUpdateList = true;
				}
			}
		})
		this.students.currentTotal.subscribe(total => this.deducts = total);
		this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
		let current = localStorage.getItem("current-courses");
		if(current != null){
			this.currentCourses = JSON.parse(current);
			this.isLoading[0] = false;
		}else{
			this.getList.get("current").then(data => { 
				try{
					this.currentCourses = data.json();
					try{
						localStorage.setItem("current-courses", JSON.stringify(this.currentCourses));
					}catch(e){
						let currentUser = localStorage.getItem("currentUser");
						localStorage.clear();
						localStorage.setItem("currentUser", currentUser);
					}
					
				}catch(e){
					console.log(data._body);
					console.log(e);
				}
				this.isLoading[0] = false;
			});
		}
		let old = localStorage.getItem("old-courses");
		if(old != null){
			this.oldCourses = JSON.parse(old);
			this.isLoading[1] = false;
		}else{
			this.getList.get("old").then(data => { 
				console.log(data._body);
				try{
					this.oldCourses = data.json();
					try{
						localStorage.setItem("old-courses", JSON.stringify(this.oldCourses)); 
					}catch(e){
						let currentUser = localStorage.getItem("currentUser");
						localStorage.clear();
						localStorage.setItem("currentUser", currentUser);
					}
					
				}catch(e){
					console.log(data._body);
					console.log(e);
				}
				this.isLoading[1] = false;
			});
		}
		let all = localStorage.getItem("all-courses");
		if(all != null){
			this.courseList = JSON.parse(all);
			this.isLoading[2] = false;
		}else{
			this.getList.get().then(data => { 
				try{
					this.courseList = data.json();
					try{
						localStorage.setItem("all-courses", JSON.stringify(this.courseList));
					}catch(e){
						let currentUser = localStorage.getItem("currentUser");
						localStorage.clear();
						localStorage.setItem("currentUser", currentUser);
					}
					
					this.courseList.forEach((el, index, arr) => {
						if(this.currentCourses.indexOf(el) !== -1){
							el.class = 2;
						}else if (this.oldCourses.indexOf(el) !== -1){
							el.class = 1;
						}else{
							el.class = 3;
						}
					})
				}catch(e){
					console.log(data._body);
					console.log(e);
				}
				this.isLoading[2] = false;
			});
		}

		this.dataSrv.getTypeList().then(res => this.types = res.json());
	}
	//For departments view
	showListOfListners(course:any): void {
		if (this.prevRow != undefined && this.prevRow !== course) {
			this.prevRow.isOpened = false;
		}
		course.isOpened = !course.isOpened;
		this.prevRow = course;
	}

	updateList(time?:string){
		localStorage.removeItem(time + "-courses");
		let data = time || "";
		switch(time){
			case "current":
				this.isLoading[0] = true;
				break;
			case "old":
				this.isLoading[1] = true;
				break;
			case "":
				this.isLoading[2] = true;
				break;
		}
		this.getList.get(data).then(data => { 
			console.log(data._body);
			try{
				switch(time){
					case "current":
						this.isLoading[0] = false;
						this.currentCourses = data.json();
						break;
					case "old":
						this.isLoading[1] = false;
						this.oldCourses = data.json();
						break;
					case "":
						this.isLoading[2] = false;
						this.courseList = data.json();
						break;
				}
				this.oldCourses = data.json();
				localStorage.setItem("old-courses", JSON.stringify(this.oldCourses)); 
			}catch(e){
				console.log(data._body);
				console.log(e);
			}
			this.isLoading[1] = false;
			this.shouldUpdateList = false;
			this.share.deleteUpdates("studList");
		});
	}
	getArchive(){
		this.getList.getArchive().then(data => {
			try{
				this.ArchiveIsLoaded = true;
				this.archive = data.json();
			}catch(e){
				this.ErrorAction(e, data);
			}
		})
	}
	DownloadInfo(year){
		this.ArchiveYearIsLoaded = false;
		let data = JSON.parse(localStorage.getItem('archive-' + year));
		if (data !== null) {
			this.archive[year] = data;
			this.ArchiveYearIsLoaded = true;
		}else{
			this.getList.getArchiveByYear(year, {limit: 0, offset: 0}).then(data => {
				this.ArchiveYearIsLoaded = false;
				try{
					this.archive[year] = data.json();
					localStorage.setItem("archive-" + year, JSON.stringify(data.json()));
				}catch(e){
					this.ErrorAction(e, data);
				}
				this.ArchiveYearIsLoaded = true;
			})
		}
	}

	ErrorAction(e, data){
		console.log(e);
		console.log(data._body);
		this.notify.addError(data._body);
		this.log.SendError({page: "studList", error: e, response: data});
	}
}