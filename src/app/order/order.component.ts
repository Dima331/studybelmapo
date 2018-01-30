import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { listLocales } from 'ngx-bootstrap/bs-moment';
import { MakeOrderService } from "./makeOrder.service";
import { Http } from "@angular/http";
import { Global } from '../model/global.class';
import "rxjs/add/operator/toPromise";
import {NotificationsService} from 'angular4-notify';
import { CurrentCourcesListService } from '../FillData/services/getCurrentCourcesList.service';
@Component({
	templateUrl: './order.component.html',
	providers: [MakeOrderService, CurrentCourcesListService, BsModalService],
	styles:[`
		.table-striped>tbody>tr.selected{
			background-color: #9368E9;
			color:#fff;
		}
		.btn.selected{
			background:#888888;
			color:#fff;
		}
	`]
})

export class OrderComponent implements OnInit{
	@ViewChild('certificates') cert: TemplateRef<any>;
	@ViewChild('examlist') examlist: TemplateRef<any>;
	bsValue: Date = new Date();
	globalParams: Global = new Global();
  	locales = listLocales();
  	data:any = {
  		selectedCourses: [],
  		prorector: "Т.В.Калининой",
  		headmaster: "",
  		exam_list_numer: "",
  		examDate: undefined,
  		exam_date: "",
  		exam_form: 0
  	};
  	message: string = "";
  	courses: any[] = [];
  	currentUser = JSON.parse(localStorage.getItem("currentUser"));
	bsConfig: Partial<BsDatepickerConfig> =  Object.assign({}, { containerClass: "theme-blue", locale: this.globalParams.locale, dateInputFormat: 'DD.MM.YYYY' });
	modalRef: BsModalRef;
	constructor(private makeOrderService: MakeOrderService,
				private http: Http,
				private notify: NotificationsService,
				private modal: BsModalService,
				private courseList: CurrentCourcesListService){}
	ngOnInit(){
		this.courseList.get().then(res => {
			try{
				this.courses = res.json()
			}catch(e){
				console.log(e);
				console.log(res._body);
			}
		})
	}
	EnterAction(flag:number):void{
		this.data.type = flag;
		switch (flag) {
			case 2:
				this.modalRef = this.modal.show(this.cert, {class: 'modal-md'});
				break;
			case 3:
				this.modalRef = this.modal.show(this.examlist, {class: 'modal-md'});
				break;
			default:
				// code...
				break;
		}
	}
	BuildOrder(flag?:number): void{
		if (flag !== undefined) {
			this.data.type = flag;
		}
		if (this.data.selectedCourses.length === 0) {
			this.notify.addError("Виберите курс");
			return;
		}else if(this.data.type == undefined){
			this.notify.addError("Виберите приказ");
			return;
		}
		if (this.data.examDate != undefined) {
			console.log(this.data.examDate);
			this.data.exam_date = this.data.examDate.getDate() + "." + this.data.examDate.getMonth() + "." + this.data.examDate.getFullYear();
		}
		this.makeOrderService.create(this.data).then(data => {
            var blob = new Blob([data._body], {type: 'application/vnd.msword'});
            var objectUrl = URL.createObjectURL(blob);   
            var filename = "doc.doc";
            var a = document.createElement("a");
            a.href = objectUrl;
            a["download"] = filename;

            var e = document.createEvent("MouseEvents");
            e.initMouseEvent("click", true, false,
			    document.defaultView, 0, 0, 0, 0, 0,
			    false, false, false, false, 0, null);
			a.dispatchEvent(e);
        });
	}
	GetCoursesList(value:Date, flag:number){
		if (flag === 0) {
			this.data.dateFrom = value.toISOString().slice(0, 10);
		}else{
			this.data.dateTo = value.toISOString().slice(0, 10);
		}
		this.makeOrderService.getList(this.data).then(data => {
			try{
				this.courses = data.json();
				this.message = "";
			}
			catch(e){
				console.log(data._body);
				this.courses = [];
				this.message = "Нет курсов удовлетворяющих запросу";
			}
		});
	}
	selectCourse(course:any): void{
		if (this.data.selectedCourses.indexOf(course) !== -1) {
			var index = this.data.selectedCourses.indexOf(course);
			this.data.selectedCourses.splice(index, 1);
		}else{
			this.data.selectedCourses.push(course);
		}
	}
}