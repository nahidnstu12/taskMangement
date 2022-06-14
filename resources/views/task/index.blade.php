@extends('layout.app')

@section('content')
{{-- main content --}}
<div class="container">
  <div class="row my-5">
    <div class="col-lg-12">
      <div class="card shadow">
        <div class="card-header bg-primary d-flex justify-content-between align-items-center">
          <h3 class="text-light">Manage Tasks</h3>
          <button class="btn btn-light" data-toggle="modal" data-target="#addTaskModal"><i
              class="bi-plus-circle me-2"></i>Add New Task</button>
        </div>
        {{-- adding filters --}}
        <div class="card-header bg-primary d-flex justify-content-between align-items-center">
          <form class="w-100">
            @csrf
            <div class="row">
              <div class="col">
                <div class="input-group mb-3">
                  <div class="input-group-prepend">
                    @if($isAdmin)
                    <div class="input-group-text align-items-center " style="gap: 8px;">
                      <input type="checkbox" aria-label="Checkbox for following text input" id="showall" name="show" >
                      <label for="showall">Show All</label>
                    </div>
                    @endif
                  </div>
                  {{-- <input type="text" class="form-control" aria-label="Text input with checkbox"> --}}
                </div>
              </div>
              <div class="col d-flex justify-content-end">
               <div id="btnContainer">
                <div class="btn listview active" ><i class="fa fa-bars"></i> List</div>
                <div class="btn  gridview" ><i class="fa fa-th-large"></i> Grid</div>
              </div>
              </div>
            </div>
          </form>
        </div>
        <div class="card-body" id="show_all_tasks">
          {{-- @if ($tasks->count() < 0) <h1 class="text-center text-secondary my-5">Loading...</h1>
            @else
            @include('task.layout')
            @endif --}}


        </div>
      </div>

    </div>
    <div class="pagination justify-content-end align-items-center m-auto">
      
  </div>
  </div>
</div>
{{-- main content end --}}
{{-- add modal --}}
<div class="modal fade" id="addTaskModal" tabindex="-1" aria-labelledby="exampleModalLabel" role="dialog"
  aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Add New Task</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <form method="POST" id="add_task_form" enctype="multipart/form-data">
        @csrf
        <div class="modal-body p-4 bg-light">
          {{-- <input type="hidden" name="userid" class="form-control" value="{{Auth::id()}}"> --}}
          <div class="row">
            <div class="col-12">
              <label for="tasktitle">Task Title</label>
              <input type="text" name="tasktitle" class="form-control" placeholder="Task Titile" required>
            </div>
            <div class="col-12">
              <label for="description">Description</label>
              <input type="text" name="description" class="form-control" placeholder="Description" required>
            </div>
          </div>

          <div class="my-2">
            <label for="image">Select Image</label>
            <input type="file" name="image" class="form-control">
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="submit" id="add_task_btn" class="btn btn-primary">Add Task</button>
        </div>
      </form>
    </div>
  </div>
</div>


{{-- edit modal --}}
<div class="modal fade" id="editTaskModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Edit Task</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <form action="#" method="POST" id="edit_task_form" enctype="multipart/form-data">
        @csrf
        <input type="hidden" name="task_id" id="task_id">
        <input type="hidden" name="task_image" id="task_image">
        <div class="modal-body p-4 bg-light">
          <div class="row">
            <div class="col-12">
              <label for="tasktitle">Task Title</label>
              <input type="text" name="tasktitle" id="tasktitle" class="form-control" placeholder="First Name" required>
            </div>
            <div class="col-12">
              <label for="description">Description</label>
              <input type="text" name="description" id="description" class="form-control" placeholder="Description"
                required>
            </div>
          </div>

          <div class="my-2">
            <label for="image">Select Image</label>
            <input type="file" name="image" class="form-control">
          </div>
          <div class="mt-2" id="task_image">

          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="submit" id="edit_task_btn" class="btn btn-success">Update Task</button>
        </div>
      </form>
    </div>
  </div>
</div>

{{-- edit modal --}}


@endsection

