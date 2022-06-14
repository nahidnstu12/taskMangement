//layout
let activelayout = $('.active').attr('class').split(" ").includes("listview")
let activeClass = "listview"
$(function () {
    $(document).on("click", ".listview", function (event) {
        $(".card-view").removeClass("col-xl-3 col-sm-6");
        // console.log("listview");
        $(".card-view").addClass("col-12");
        $(".img-thumbnail").removeClass("mx-auto");
        $("#img-div").addClass("d-flex justify-content-between");
        activeClass = "listview"
    });

    $(document).on("click", ".gridview", function (event) {
        $(".card-view").removeClass("col-12");
        $("#img-div").removeClass("d-flex justify-content-between");
        // console.log("listview");
        $(".card-view").addClass("col-xl-3 col-sm-6");
        $(".img-thumbnail").addClass("mx-auto");
        activeClass = "gridview"
    });
    /*  Add active class to the current button (highlight it) */
    let container = document.getElementById("btnContainer");
    let btns = container.getElementsByClassName("btn");
    for (let i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function () {
            let current = document.getElementsByClassName("active");
            current[0].className = current[0].className.replace(" active", "");
            this.className += " active";
        });
    }
});

$(document).ready(function () {
    // add new task ajax request
    $("#add_task_form").submit(function (e) {
        $.ajaxSetup({
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
        });
        e.preventDefault();
        const fd = new FormData(this);
        $("#add_task_btn").text("Adding...");
        $.ajax({
            url: "/store",
            method: "post",
            data: fd,
            cache: false,
            contentType: false,
            processData: false,
            dataType: "json",
            success: function (response) {
                // console.log(response);

                if (response.status == 200) {
                    Swal.fire("Added!", "Tasks Added Successfully!", "success");
                    fetchTasks();
                }
                $("#add_task_btn").text("Add Tasks");
                $("#add_task_form")[0].reset();
                $("#addTaskModal").modal("hide");
            },
        });
    });

    // edit task ajax request
    $(document).on("click", ".editIcon", function (e) {
        $.ajaxSetup({
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
        });
        e.preventDefault();
        let id = $(this).attr("id");
        $.ajax({
            url: "/edit",
            method: "get",
            data: {
                id: id,
                // _token: "{{csrf_token()}}"
                // _token: "<?php csrf_token() ?>"
            },
            success: function (response) {
                console.log(response);
                
                $("#tasktitle").val(response.tasktitle);
                $("#description").val(response.description);

                $("#task_image").html(
                    `<img src="/storage/images/${response.image}" width="100" class="img-fluid img-thumbnail"/>`
                );
                $("#task_id").val(response.id);
                $("#image").val(`storage/images/${response.image}`);
                
            },
        });
    });

    // update task ajax request
    $("#edit_task_form").submit(function (e) {
        e.preventDefault();
        $.ajaxSetup({
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
        });
        const fd = new FormData(this);
        $("#edit_task_btn").text("Updating...");
        $.ajax({
            url: "/update",
            method: "post",
            data: fd,
            cache: false,
            contentType: false,
            processData: false,
            dataType: "json",
            success: function (response) {
                if (response.status == 200) {
                    Swal.fire(
                        "Updated!",
                        "Tasks Updated Successfully!",
                        "success"
                    );
                    fetchTasks();
                }
                $("#edit_task_btn").text("Update Tasks");
                $("#edit_task_form")[0].reset();
                $("#editTaskModal").modal("hide");
            },
        });
    });

    // delete task ajax request
    $(document).on("click", ".deleteIcon", function (e) {
        e.preventDefault();
        $.ajaxSetup({
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
        });
        let id = $(this).attr("id");
        // let csrf = "<?php csrf_token() ?>";
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: "/delete",
                    method: "delete",
                    data: {
                        id: id,
                        // _token: csrf
                    },
                    success: function (response) {
                        // console.log(response);
                        Swal.fire(
                            "Deleted!",
                            "Your file has been deleted.",
                            "success"
                        );
                        fetchTasks();
                    },
                });
            }
        });
    });
    //
    $("#showall:checkbox").bind("change", function (e) {
        if ($(this).is(":checked")) {
            fetchTasks();
            // console.log("all task");
        } else {
            // console.log("user task");
            fetchTasks();
        }
    });

    // fetch all tasks ajax request
    fetchTasks();

    function fetchTasks() {
        
        
        
        $.ajaxSetup({
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
        });

        $.ajax({
            url: "/show-all",
            method: "post",
            data: { check: $('input[name="show"]').prop("checked") },
            success: function (response) {
                // console.log(response);

                bodyDataHtml(response);

                $(document).on("click", "#nextBtn", function (event) {
                    let nextPageUrl = response.tasks.path;
                    let page = $(this).data("nextpage");
                    let totalpage = response.tasks.last_page;
                    // console.log({ page, nextPageUrl, totalpage });
                    if (totalpage >= page) {
                        $.post(
                            `${nextPageUrl}?page=${page}`,
                            { check: $('input[name="show"]').prop("checked") },
                            function (result) {
                                bodyDataHtml(result);
                            }
                        );
                    }
                });

                $(document).on("click", "#prevBtn", function (event) {
                    let prevPageUrl = response.tasks.path;
                    let page = $(this).data("prevpage");
                    let totalpage = response.tasks.last_page;
                    // console.log({ page, prevPageUrl, totalpage });
                    if (page > 0) {
                        $.post(
                            `${prevPageUrl}?page=${page}`,
                            { check: $('input[name="show"]').prop("checked") },
                            function (result) {
                                bodyDataHtml(result);
                            }
                        );
                    }
                });
            },
        });
    }
    // grid view
});
// console.log($("#nextBtn").data("page"));

function bodyDataHtml(response) {
    // console.log( {activelayout, activeClass});
   
    $("#show_all_tasks .container").remove();
    $(".pagination .container").remove();

    var resultData = response.tasks.data;

    var pagiantionData = "";

    pagiantionData += `<div class="container" style="display:flex; margin-top:12px">`;
    pagiantionData += `<button class="btn btn-sm btn-primary px-2 mx-5" id="prevBtn" data-prevpage="${
        response.tasks.current_page - 1
    }">prev </button>`;

    pagiantionData += `<p> ${response.tasks.current_page}</p>`;

    pagiantionData += `<button class="btn btn-sm btn-primary px-2 mx-5" data-nextpage="${
        response.tasks.current_page + 1
    }"   id="nextBtn">Next</button>`;

    pagiantionData += `</div>`;

    // task body card
    var bodyData = `<div class="container">
    <div class="row text-center">`;
    console.log({
        tasks: response.tasks,
        msg: "fetch task function",
        url: response.tasks.next_page_url,
    });

    $.each(resultData, function (index, task) {
        let adminAction = task.user_id !== response.userid;
        // console.log({adminAction});
        

        bodyData += `
        <div class="col-12 mb-5 card-view" style="box-shadow: 0 3px 10px rgb(0 0 0 / 0.2); ">
            <div class="bg-white rounded shadow-sm py-5 px-4 d-flex justify-content-between" id="img-div">
                <img src="storage/images/${
                    task.image
                }" alt="" width="150" class="img-fluid rounded-circle mb-3 img-thumbnail shadow-sm"/>
                <div class="text-center">
                    <h5 class="mb-0">${task.tasktitle}</h5>
                    <span class="small text-uppercase text-muted">ID: ${
                        task.user_id
                    }</span>
                </div>
            </div>
            <div class="d-flex justify-between">
            <p class="mt-3" style="text-align: justify; max-width:85%;">${
                task.description
            }</p>
            <div class="d-flex align-items-center px-2">
                <a href="#" id="${task.id}" class="text-success mx-1 editIcon ${
            adminAction ? " disabled" : ""
        }"  data-toggle="modal" data-target="#editTaskModal"><i class="fas fa-marker"></i>
                </a>
                <a href="#" id="${task.id}" class="text-danger mx-1 deleteIcon ${
                    adminAction ? "disabled" : ""
                }"><i class="fas fa-trash"></i>
                </a>

            </div>
        </div>
        </div>
        `;
    });
    bodyData += `</div></div>`;

    $("#show_all_tasks").append(bodyData);
    $(".pagination").append(pagiantionData);
    $(`.${activeClass}`).click();
}

/// pagiantion
// $(document).ready(function () {
//     $(document).on("click", ".pagination a", function (event) {
//         event.preventDefault();
//         var page = $(this).attr("href").split("page=")[1];

//         fetch_data(page);
//     });

//     function fetch_data(page) {
//         $.ajax({
//             url: "show-all?page=" + page,
//             success: function (response) {
//                 console.log({
//                     tasks: response.tasks.data,
//                     msg: "pagination function",
//                 });
//                 $("#show_all_tasks").html(response.tasks.data);
//             },
//         });
//     }
// });
