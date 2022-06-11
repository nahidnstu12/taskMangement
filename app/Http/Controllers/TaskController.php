<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class TaskController extends Controller
{
	public function index()
	{
		$isAdmin = Auth::user()->role === "1";
		// dd($isAdmin);
			$tasks = Auth::user()
			->tasks()
			->orderByDesc('created_at')
			->paginate(5);
		// return view("task.index")->with("tasks",$tasks);
		return view("task.index", compact("tasks", "isAdmin"));
	}
	public function gridView()
	{
		$isAdmin = Auth::user()->role === "1";
		// dd($isAdmin);
		$tasks = Auth::user()
			->tasks()
			->orderByDesc('created_at')
			->paginate(5);
		// return view("task.index")->with("tasks",$tasks);
		return view("task.index", compact("tasks", "isAdmin"));
	}
	public function showAll(Request $request)
	{
		$tasks = Task::paginate(2);

		if ($request->ajax()) {
			return view("task.fetchAll", compact("tasks"));
		}
		return view("task.index", compact("tasks"));
		// $output = '';
		// if ($tasks->count() > 0) {
		// 	$output .= '<table class="table table-striped table-sm text-center align-middle">
        //     <thead>
        //       <tr>
        //         <th>ID</th>
        //         <th>Image</th>
        //         <th>Task Name</th>
        //         <th>Description</th>
        //         <th>Action</th>
        //       </tr>
        //     </thead>
        //     <tbody>';
		// 	foreach ($tasks as $task) {
		// 		$imageUrl = $task->image ?? "dummy.png";
		// 		$output .= '<tr>
        //         <td>' . $task->id . '</td>
        //         <td><img src="storage/images/' . $imageUrl . '" width="50" class="img-thumbnail rounded-circle"></td>
        //         <td>' . $task->tasktitle . '</td>
		// 		<td> ' . $task->description . '</td>
               
        //         <td>
        //           <a href="#" id="' . $task->id . '" class="text-success mx-1 editIcon" data-toggle="modal" data-target="#editTaskModal"><i class="fas fa-marker"></i></a>

        //           <a href="#" id="' . $task->id . '" class="text-danger mx-1 deleteIcon"><i class="fas fa-trash"></i></a>
        //         </td>
        //       </tr>';
		// 	}
		// 	$output .= '</tbody></table>';
		// 	echo $output;
		// } else {
		// 	echo '<h1 class="text-center text-secondary my-5">No record present in the database!</h1>';
		// }
	}
	// handle fetch all eamployees ajax request
	public function fetchAll(Request $request)
	{
		$tasks = Auth::user()
			->tasks()
			->orderByDesc('created_at')
			->paginate(5);
		if($request->ajax()){
			return view("task.fetchAll", compact("tasks"));
		}
		return view("task.index", compact("tasks"));
		// $output = '';
		// if ($tasks->count() > 0) {
		// 	$output .= '<table class="table table-striped table-sm text-center align-middle">
        //     <thead>
        //       <tr>
        //         <th>ID</th>
        //         <th>Image</th>
        //         <th>Task Name</th>
        //         <th>Description</th>
        //         <th>Action</th>
        //       </tr>
        //     </thead>
        //     <tbody>';
		// 	foreach ($tasks as $task) {
		// 		$imageUrl = $task->image ?? "dummy.png";
		// 		$output .= '<tr>
        //         <td>' . $task->id . '</td>
        //         <td><img src="storage/images/' . $imageUrl . '" width="50" class="img-thumbnail rounded-circle"></td>
        //         <td>' . $task->tasktitle . '</td>
		// 		<td> ' . $task->description . '</td>
               
        //         <td>
        //           <a href="#" id="' . $task->id . '" class="text-success mx-1 editIcon" data-toggle="modal" data-target="#editTaskModal"><i class="fas fa-marker"></i></a>

        //           <a href="#" id="' . $task->id . '" class="text-danger mx-1 deleteIcon"><i class="fas fa-trash"></i></a>
        //         </td>
        //       </tr>';
		// 	}
		// 	$output .= '</tbody></table>';
		// 	echo $output;
		// } else {
		// 	echo '<h1 class="text-center text-secondary my-5">No record present in the database!</h1>';
		// }
	}

	// handle insert a new taskloyee ajax request
	public function store(Request $request)
	{
		$file = $request->file('image');
		$fileName = null;
		if ($request->hasFile("image")) {
			$fileName = time() . '.' . $file->getClientOriginalExtension();
			$file->storeAs('public/images', $fileName);
		}

		$data = $this->validate($request, [
			'tasktitle' => 'required|string|max:255',
			'description' => 'required|string|max:255',
		]);

		Auth::user()->tasks()->create([
			'tasktitle' => $data['tasktitle'],
			'description' => $data["description"],
			'image' => $fileName
		]);

		return response()->json([
			'status' => 200,
		]);
	}

	// handle edit an taskloyee ajax request
	public function edit(Task $task, Request $request)
	{
		// dd($task->id);
		// $this->authorize('editView', $task);
		$id = $request->id;
		$task = Task::find($id);
		return response()->json($task);
	}

	// handle update an taskloyee ajax request
	public function update(Task $task, Request $request)
	{
		// $this->authorize('complete', $task);
		$fileName = '';
		$task = Task::find($request->task_id);
		if ($request->hasFile('image')) {
			$file = $request->file('image');
			$fileName = time() . '.' . $file->getClientOriginalExtension();
			$file->storeAs('public/images', $fileName);
			if ($task->image) {
				Storage::delete('public/images/' . $task->image);
			}
		} else {
			$fileName = $request->task_image;
		}

		$taskData = ['tasktitle' => $request->tasktitle, 'description' => $request->description, 'image' => $fileName];

		$task->update($taskData);
		return response()->json([
			'status' => 200,
		]);
	}

	// handle delete an taskloyee ajax request
	public function delete(Task $task, Request $request)
	{
		// dd($task->id);
		$this->authorize('deleteTask', $task);
		$id = $request->id;

		$task = Task::find($id);
		// return response()->json($task);
		if ($task->count() > 0) {
			Storage::delete('public/images/' . $task->image);
			Task::destroy($id);
		}
	}
}