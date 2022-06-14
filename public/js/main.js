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
                    fetchAllTasks();
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
                    fetchAllTasks();
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
                        fetchAllTasks();
                    },
                });
            }
        });
    });
    //
    $("#showall:checkbox").bind("change", function (e) {
        if ($(this).is(":checked")) {
            admin();
            console.log("admin")
        } else {
          console.log("user")
            fetchAllTasks();
        }
    });

    

    // fetch all tasks ajax request
    fetchAllTasks();

    function fetchAllTasks() {
        //   console.log("hell0");

        $.ajax({
            url: "/fetchall",
            method: "get",
            success: function (response) {
                // console.log(response);

                $("#show_all_tasks").html(response);
                
            },
        });
    }
    function admin() {
        //   console.log("hell0");
        // $("#DataTables_Table_0_info").hide();
        $.ajaxSetup({
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
        });
        $.ajax({
            url: "/show-all",
            method: "post",
            data: {check:$('input[name="show"]').prop('checked')},
            success: function (response) {
                console.log(response);

                $("#show_all_tasks").html(response);
               
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
             url: "/pagination/fetch_data?page=" + page,
             success: function (data) {
                 // console.log(data)
                 $("#show_all_tasks").html(data);
             },
         });
     }
 });