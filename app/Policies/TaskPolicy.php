<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Task;
use Illuminate\Auth\Access\HandlesAuthorization;

class TaskPolicy
{
    use HandlesAuthorization;

    /**
     * Create a new policy instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }
    public function deleteTask(User $user, Task $task)
    {
        return $user->id === $task->user_id;
    }
    public function editView(User $user, Task $task)
    {
        return $user->id === $task->user_id;
        // return $user->is($task->user);
        // return true;
    }
    public function adminView(User $user, Task $task)
    {
        return $user->role === 1 && $user->is($task->user) ;
    }
}