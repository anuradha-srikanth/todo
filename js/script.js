// Global variables because they are constants
var mon;
var day;
var year;
var mon_list = [
[1, "January", 31],
[2, "February", 28],
[3, "March", 31],
[4, "April", 30],
[5, "May", 31],
[6, "June", 30],
[7, "July", 31],
[8, "August", 30],
[9, "September", 31],
[10, "October", 30],
[11, "November", 31],
[12, "December", 30]
];

//Hide the templates that need to be hidden, set css properties of the 
$(document).ready(function () {
    //jQuery Dom Manipulation 
    $("#calendar").hide();
    $(".item_template").hide();
    $(".error").hide();

    //jQuery Dom Manipulation 
    $("#pickDate").css("border-color", "tomato");

    //initialize the date picker 
    $( "#datepicker" ).datepicker({
        minDate: new Date("2017-01-02"),
        maxDate: new Date("2017-12-31")
    });

    //once the user picks a date, the date global is displayed on the calendar
    //and the json information is loaded into it. 
    $('#pickDate').submit(function(event){
        event.preventDefault();
        changeDate();
        doXMLHttpRequest();
    });

});

/*
 * changeDate() is a function that changes the global date variable and changes
 * the calendar to reflect the date that the user has selected
 */

function changeDate(){
    //jQuery Dom Manipulation 
    $("#calendar").show();
    var date = $("#datepicker").datepicker("getDate");
    day = date.getDate();
    mon = date.getMonth();
    year = date.getFullYear();

    //jQuery Dom Manipulation, chained method
    $(".days li .active").removeClass("active").addClass('tag');

    for(var i=0; i<$(".days li").length; i++){
        if($(".days li")[i].value == day){
            $(".days li")[i]["childNodes"][0].setAttribute("class","active");
        }else{
             //jQuery Dom Manipulation 
             $(".days li").addClass('tag');
         }
     }

    //jQuery Dom Manipulation
    $("#month").text( mon_list[mon][1]);
    $("#year").text(year);


    if(mon_list[mon][2] == 28){
        //jQuery Dom Manipulation
        $(".opt-feb1").remove();
        $(".opt-feb2").remove();
        $(".optional").remove();
    }else if(mon_list[mon][2] == 30){
        //jQuery Dom Manipulation
        if (!($(".days li").hasClass("opt-feb1"))){
            $(".days .wrap").append("<li class='opt-feb1 tag' value='29'><span>29</span></li>");
        }
        if (!($(".days li").hasClass("opt-feb2"))){
            $(".days .wrap").append("<li class='opt-feb2 tag' value='30'><span>30</span></li>");
        }if($(".days li ").hasClass("optional")){
            $(".optional").remove();
        }
    }else{
        //jQuery Dom Manipulation
        if (!($(".days li").hasClass("optional"))){
            $(".days .wrap").prepend("<li class='optional tag' value='31'><span>31</span></li>");
        }
        if (!($(".days li").hasClass("opt-feb2"))){
            $(".days .wrap").prepend("<li class='opt-feb2 tag' value='30'><span>30</span></li>");
        }
        if (!($(".days li ").hasClass("opt-feb1"))){
            $(".days .wrap").prepend("<li class='opt-feb1 tag' value='29'><span>29</span></li>");
        }
    }
}

/* 
 * doXMLHttpRequest() is the function that calls a function that processes json 
 * document. If this function is not successful, an error code is generated and 
 * displayed to the user. The request is made to the json document via an AJAX 
 * and information is added to your page. 
 * 
 */
function doXMLHttpRequest() {
    xhr = new XMLHttpRequest(); 

    xhr.onreadystatechange=function()  {
       if (xhr.readyState==4) {
           if(xhr.status == 200) {
            processResponse(xhr.responseText);
        } else {
            //jQuery Dom Manipulation, chained method
            $("#responseArea").append($(".error").clone().css("display", "block"));
            $("#responseArea #code").text("Error code " + xhr.status);
            }
        }
    }
    xhr.open("GET", "list.json", true); 
    xhr.send();
}

/* 
 * processResponse() takes in the json response that it recieves from the AJAX 
 * request and parses it into a list item format, with all the css and js that 
 * goes into that format. 
 *
 */
function processResponse(responseJSON) {
    var list = JSON.parse(responseJSON);
    var displayText = "";
    if(list.items.length == 0){
        displayText = "You have nothing to do today.";
    }else{
        displayText = "<ul class='items'> ";
        for (var i = 0; i < list.items.length; i++) {
            var item = list.items[i];
            var name = item.name;
            var item_mon = item.date.substring(0,2);
            var item_day = item.date.substring(3,5);
            var item_year = item.date.substring(6,);
            var loc = item.location;
            var time = item.time;
            var array = [name, mon, day, year, loc, time];
            if(item_mon == mon && item_day == day && item_year == year){
                displayText += makeListItem(array);
            }
        }
        displayText += "</ul>";
        document.getElementById("responseArea").innerHTML = displayText;
    }
}

/*
 * makeListItem() returns the html required for a list item that is placed after
 * the calendar.
 */
function makeListItem(array){
    return " <li> <span> <p id='name'> To do: "+array[0]+" </p> <p id='loc'> Location: " + array[4] + "</p> <p id='loc'> Time: " + array[5] + "</p> </span> </li> ";
}
