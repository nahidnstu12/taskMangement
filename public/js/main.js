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
                console.log(response);

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
                        console.log(response);
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
        } else {
            fetchAllTasks();
        }
    });

    $(".layout").click(function () {
        var layout = $(this).data("layout");
        // alert($(this).data("layout"));
        let url = layout === "listview" ? "/fetchall" : "/grid";
        if (layout === "listview") {
            $.ajax({
                url: "/fetchall",
                method: "get",
                success: function (response) {
                    // console.log(response);

                    $("#show_all_tasks").html(response);
                    $("table").DataTable({
                        order: [0, "desc"],
                        paging: false,
                        bPaginate: false,
                    });
                },
            });
        } else {
            $.ajax({
                url: "/grid",
                method: "get",
                success: function (response) {
                    console.log(response);

                    $("#show_all_tasks").html(response);
                },
            });
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
                $("table").DataTable({
                    order: [0, "desc"],
                    paging: false,
                    bPaginate: false,
                });
            },
        });
    }
    function admin() {
        //   console.log("hell0");
        // $("#DataTables_Table_0_info").hide();
        $.ajax({
            url: "/show-all",
            method: "get",
            success: function (response) {
                // console.log(response);

                $("#show_all_tasks").html(response);
                $("table").DataTable({
                    order: [0, "desc"],
                    paging: false,
                    bPaginate: false,
                });
            },
        });
    }
    // grid view
});

// pagination
$(window).on("hashchange", function () {
    if (window.location.hash) {
        var page = window.location.hash.replace("#", "");
        if (page == Number.NaN || page <= 0) {
            return false;
        } else {
            console.log("pagon");
            getData(page);
        }
    }
});

$(document).ready(function () {
    $(document).on("click", ".pagination a", function (event) {
        event.preventDefault();

        $("li").removeClass("active");
        $(this).parent("li").addClass("active");

        var myurl = $(this).attr("href");
        var page = $(this).attr("href").split("page=")[1];

        getData(page);
    });
});

function getData(page) {
    $.ajax({
        url: "?page=" + page,
        type: "get",
        datatype: "html",
    })
        .done(function (data) {
            $("#show_all_tasks").empty().html(data);
            location.hash = page;
        })
        .fail(function (jqXHR, ajaxOptions, thrownError) {
            alert("No response from server");
        });
}
