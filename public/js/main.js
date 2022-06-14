//layout
$(function () {
    $(".listview").click(function () {
        $(".card-view").removeClass("col-xl-3 col-sm-6");
        // console.log("listview");
        $(".card-view").addClass("col-12");
        $(".img-thumbnail").removeClass("mx-auto");
        $("#img-div").addClass("d-flex justify-content-between");
    });

    $(".gridview").click(function () {
        $(".card-view").removeClass("col-12");
        $("#img-div").removeClass("d-flex justify-content-between");
        // console.log("listview");
        $(".card-view").addClass("col-xl-3 col-sm-6");
        $(".img-thumbnail").addClass("mx-auto");
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

$(function () {
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
                $("#tasktitle").val(response.tasktitle);
                $("#description").val(response.description);

                $("#task_image").html(
                    `<img src="storage/images/${response.image}" width="100" class="img-fluid img-thumbnail"/>`
                );
                $("#task_id").val(response.id);
                $("#image").val(response.image);
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
                    url: "/delete/" + id,
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
            console.log("admin");
        } else {
            console.log("user");
            fetchTasks();
        }
    });

    // fetch all tasks ajax request
    fetchTasks();

    // function fetchTasks() {
    //     //   console.log("hell0");

    //     $.ajax({
    //         url: "/fetchall",
    //         method: "get",
    //         success: function (response) {
    //             // console.log(response);

    //             $("#show_all_tasks").html(response);
    //         },
    //     });
    // }
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
                var resultData = response.tasks.data;
                var bodyData = `<div class="container">
                <div class="row text-center">`;
                // $("#show_all_tasks .name").html(response);
                console.log({
                    tasks: response.tasks.data,
                    id: response.username,
                });

                $.each(resultData, function (index, task) {
                    let adminAction = task.user_id !== response.userid;

                    bodyData += `
                    <div class="col-12 mb-5 card-view" style="box-shadow: 0 3px 10px rgb(0 0 0 / 0.2); ">
                        <div class="bg-white rounded shadow-sm py-5 px-4 d-flex justify-content-between" id="img-div">
                            <img src="storage/images/${
                                task.image
                            }" alt="" width="150" class="img-fluid rounded-circle mb-3 img-thumbnail shadow-sm"/>
                            <div class="text-center">
                                <h5 class="mb-0">${task.tasktitle}</h5>
                                <span class="small text-uppercase text-muted">ID: ${
                                    response.userid
                                }</span>
                            </div>
                        </div>
                        <div class="d-flex justify-between">
                        <p class="mt-3" style="text-align: justify; max-width:85%;">${
                            task.description
                        }</p>
                        <div class="d-flex align-items-center px-2">
                            <a href="#" id="${
                                task.id
                            }" class="text-success mx-1 editIcon ${
                        adminAction ? " disabled" : ""
                    }" onmouseover="${adminAction} &&    alert('you haven\'t permission')" data-toggle="modal" data-target="#editTaskModal"><i class="fas fa-marker"></i>
                            </a>

                            <a href="#" id="${
                                task.id
                            }" class="text-danger mx-1 deleteIcon ${
                        adminAction ? " disabled" : ""
                    }" onmouseover="${adminAction} && alert('you haven\'t permission')">
                                <i class="fas fa-trash"></i>
                            </a>
                        </div>
                    </div>
                    </div>
                    `;
                });
                bodyData += `</div></div>`;

                $("#show_all_tasks").append(bodyData);
            },
        });
    }
    // grid view
});

/// pagiantion
$(document).ready(function () {
    $(document).on("click", ".pagination a", function (event) {
        event.preventDefault();
        var page = $(this).attr("href").split("page=")[1];

        fetch_data(page);
    });

    function fetch_data(page) {
        $.ajax({
            url: "show-all?page=" + page,
            success: function (data) {
                console.log(data.data)
                $("#show_all_tasks").html(data.data);
            },
        });
    }
});
