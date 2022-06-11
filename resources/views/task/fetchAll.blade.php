<table class="table table-striped table-sm text-center align-middle">
    <thead>
        <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Task Name</th>
            <th>Description</th>
            <th>Action</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($tasks as $task)
        @php
        $imageUrl = $task->image ?? "dummy.png";
        @endphp
        <tr>
            <td>{{ $task->id }}</td>
            <td><img src="storage/images/{{ $imageUrl }}" width="50" class="img-thumbnail rounded-circle"></td>
            <td>{{ $task->tasktitle }}</td>
            <td> {{ $task->description }}</td>

            <td>
                <a href="#" id="{{ $task->id }}" class="text-success mx-1 editIcon" data-toggle="modal"
                    data-target="#editTaskModal"><i class="fas fa-marker"></i></a>

                <a href="#" id="{{ $task->id }}" class="text-danger mx-1 deleteIcon"><i class="fas fa-trash"></i></a>
            </td>
        </tr>
        @endforeach
    </tbody>
</table>

{!! $tasks->render() !!}