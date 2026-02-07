import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Edit, Trash2, Plus, X, Save } from 'lucide-react';
import supabase from '../supabase-client';

export const ToDoList = ({ session }) => {
    // Main Form (New Entry)
    const { register, handleSubmit, reset } = useForm();

    // Edit Form (PIP Modal)
    const {
        register: registerEdit,
        handleSubmit: handleSubmitEdit,
        reset: resetEdit,
        setValue: setValueEdit
    } = useForm();

    const [tasks, setTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        const { data, error } = await supabase.from('tasks').select('*').order('id', { ascending: true });
        if (error) {
            console.error('Error fetching tasks:', error);
        } else {
            setTasks(data);
        }
    };

    const onSubmit = async (data) => {
        const userEmail = session.user.email;
        if (!userEmail) {
            alert("No user logged in");
            return;
        }
        const taskData = { ...data, email: userEmail };
        const { error } = await supabase.from('tasks').insert(taskData).single();
        if (error) {
            console.error('Error adding task:', error);
        } else {
            reset();
            fetchTasks();
        }
    };

    const deleteTask = async (id) => {
        const { error } = await supabase.from('tasks').delete().eq('id', id).single();
        if (error) {
            console.error('Error deleting task:', error);
        } else {
            fetchTasks();
        }
    };

    // Open Modal and populate form
    const openEditModal = (task) => {
        setEditingTask(task);
        setValueEdit('taskTitle', task.taskTitle);
        setValueEdit('taskDescription', task.taskDescription);
        setIsModalOpen(true);
    };

    // Close Modal
    const closeEditModal = () => {
        setIsModalOpen(false);
        setEditingTask(null);
        resetEdit();
    };

    // Handle Update
    const onUpdate = async (data) => {
        if (!editingTask) return;

        const { error } = await supabase
            .from('tasks')
            .update({
                taskTitle: data.taskTitle,
                taskDescription: data.taskDescription
            })
            .eq('id', editingTask.id)
            .single();
        if (error) {
            console.error('Error updating task:', error);
        } else {
            closeEditModal();
            fetchTasks();
        }
    };

    return (
        <div className="min-h-screen bg-[#fdfaf6] font-['Patrick_Hand'] text-[#374151] flex justify-center gap-10 p-[60px_20px] max-w-[1200px] mx-auto items-start flex-wrap relative">

            <div className="w-full text-center mb-5">
                <h1 className="text-[3.5rem] text-[#2e3b55] mb-2 font-normal">My Task Journal</h1>
                <p className="text-[#6b7280] text-[1.2rem] italic">Notes, thoughts, and things to get done.</p>
            </div>

            {/* Left Panel - New Entry */}
            <div className="bg-white p-0 rounded shadow-[0_4px_15px_rgba(0,0,0,0.05)] w-full max-w-[400px] relative overflow-hidden">
                <div className="p-[30px_30px_20px_30px] border-b border-[#e1e8ed]">
                    <h2 className="text-[2rem] text-[#374151] flex items-center gap-2.5 m-0 font-normal">
                        <div className="flex items-center justify-center bg-[#eef2ff] p-2 rounded-full">
                            <Plus size={24} color="#4f46e5" />
                        </div>
                        New Entry
                    </h2>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="pb-8 bg-[size:100%_3rem]" style={{ backgroundImage: 'linear-gradient(#e1e8ed 1px, transparent 1px)' }}>
                        <div className="relative border-b border-[#e1e8ed] px-[30px] h-[3rem] flex items-center">
                            <label className="uppercase text-[0.75rem] font-sans tracking-[1px] text-[#9ca3af] absolute top-[5px] left-[30px] pointer-events-none">Task Title</label>
                            <input
                                className="w-full border-none bg-transparent font-['Patrick_Hand'] text-[1.4rem] text-[#374151] outline-none pt-[10px] placeholder:text-gray-300"
                                placeholder="What's on your mind?"
                                {...register('taskTitle', { required: true })}
                                autoComplete="off"
                            />
                        </div>
                        <div className="relative border-b border-[#e1e8ed] px-[30px] h-auto min-h-[6rem] flex items-start pt-[0.8rem]">
                            <label className="uppercase text-[0.75rem] font-sans tracking-[1px] text-[#9ca3af] absolute top-[5px] left-[30px] pointer-events-none">Description</label>
                            <textarea
                                className="w-full border-none bg-transparent font-['Patrick_Hand'] text-[1.4rem] text-[#374151] outline-none pt-[10px] resize-none leading-[3rem] min-h-[5rem] placeholder:text-gray-300"
                                placeholder="Write down the details..."
                                {...register('taskDescription')}
                            ></textarea>
                        </div>
                        {/* Extra empty lines for visual effect */}
                        <div className="relative border-b border-[#e1e8ed] px-[30px] h-[3rem] flex items-center"></div>
                        <div className="relative border-b border-[#e1e8ed] px-[30px] h-[3rem] flex items-center"></div>
                    </div>

                    <div className="p-[20px_30px] bg-[size:100%_3rem]" style={{ backgroundImage: 'linear-gradient(#e1e8ed 1px, transparent 1px)' }}>
                        <button type="submit" className="w-full bg-[#2e3b55] text-white border-none p-3 font-sans font-semibold text-[1rem] cursor-pointer flex justify-center items-center gap-2 rounded transition-colors hover:bg-[#1e293b]">
                            <Plus size={20} /> Add to List
                        </button>
                    </div>
                </form>
            </div>

            {/* Right Panel - Daily Log */}
            <div className="bg-white w-full max-w-[500px] min-h-[600px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] relative p-[40px_0_60px_0]">
                {/* Red Margin */}
                <div className="absolute top-0 bottom-0 left-[60px] w-[2px] bg-[#ff9b9b] z-10"></div>

                <div className="flex justify-between items-baseline px-[40px] px-l-[80px] pb-[20px] border-b-2 border-[#e1e8ed] pl-[80px] mr-[40px]">
                    <h2 className="text-[2.5rem] m-0 text-[#2e3b55] font-normal">Daily Log</h2>
                    <span className="font-sans text-[#9ca3af] text-[0.9rem] flex-shrink-0">{tasks.length} items remaining</span>
                </div>

                <div className="p-[30px_30px_30px_80px] flex flex-col gap-5">
                    {tasks.map((task, index) => (
                        <div
                            key={task.id}
                            className={`p-[15px_20px] shadow-[2px_2px_5px_rgba(0,0,0,0.1)] relative transition-transform duration-200 hover:scale-[1.02] hover:rotate-0 hover:z-50
                                ${index % 3 === 0 ? 'bg-[#fff9c4] -rotate-1' : ''}
                                ${index % 3 === 1 ? 'bg-[#e3f2fd] rotate-1' : ''}
                                ${index % 3 === 2 ? 'bg-[#f8bbd0] -rotate-0.5' : ''}
                            `}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-[1.4rem] m-0">{task.taskTitle}</h3>
                                <div className="flex gap-2 opacity-60">
                                    <button onClick={() => openEditModal(task)} aria-label="Edit" className="bg-none border-none cursor-pointer p-[2px] text-[#6b7280] hover:text-[#374151]"><Edit size={16} /></button>
                                    <button onClick={() => deleteTask(task.id)} aria-label="Delete" className="bg-none border-none cursor-pointer p-[2px] text-[#6b7280] hover:text-[#374151]"><Trash2 size={16} /></button>
                                </div>
                            </div>
                            <p className="text-[1rem] leading-[1.4] text-[#374151] m-0">{task.taskDescription}</p>
                        </div>
                    ))}
                </div>

                <div className="absolute bottom-[20px] right-[30px] font-['Patrick_Hand'] text-[2rem] text-[#d1d5db] -rotate-3">Page 01</div>
            </div>

            {/* EDIT MODAL (PIP MODE) */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex justify-center items-center p-4">
                    {/* Yellow Pad Container */}
                    <div className="bg-[#fff9c4] w-full max-w-[500px] shadow-2xl relative p-8 rotate-1 rounded-sm min-h-[600px] flex flex-col">

                        {/* Tape Effect */}
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-white/40 backdrop-blur-md shadow-sm rotate-1 border border-white/20"></div>

                        {/* Red Margin */}
                        <div className="absolute top-0 bottom-0 left-12 w-[1px] bg-[#ff9b9b] pointer-events-none"></div>

                        {/* Close Button */}
                        <button
                            onClick={closeEditModal}
                            className="absolute top-4 right-4 text-[#8b865c] hover:text-[#5a563c] transition-colors"
                        >
                            <X size={24} />
                        </button>

                        {/* Content Header */}
                        <div className="pl-10 mb-6">
                            <h2 className="text-[1.5rem] text-[#eab308] italic opacity-80 font-normal">Editing Entry...</h2>
                        </div>

                        {/* Edit Form */}
                        <form onSubmit={handleSubmitEdit(onUpdate)} className="pl-10 flex-1 flex flex-col">

                            {/* Title Input */}
                            <div className="mb-8">
                                <label className="block text-[#2e3b55] text-[1.2rem] italic mb-1">Task Title:</label>
                                <input
                                    {...registerEdit('taskTitle', { required: true })}
                                    className="w-full bg-transparent border-0 border-b border-[#eab308]/30 font-['Patrick_Hand'] text-[2.5rem] text-[#2e3b55] outline-none placeholder:text-[#2e3b55]/30 p-0 leading-tight"
                                    placeholder="Enter title..."
                                    autoComplete="off"
                                />
                            </div>

                            {/* Description Input */}
                            <div className="flex-1 mb-[50px]">
                                <label className="block text-[#2e3b55] text-[1.2rem] italic mb-1">Description:</label>
                                <div className="bg-[size:100%_2rem] h-full min-h-[200px]" style={{ backgroundImage: 'linear-gradient(#eab30833 1px, transparent 1px)' }}>
                                    <textarea
                                        {...registerEdit('taskDescription')}
                                        className="w-full h-full bg-transparent border-none font-['Patrick_Hand'] text-[1.2rem] text-[#2e3b55] outline-none resize-none leading-[2rem] p-0 placeholder:text-[#2e3b55]/30 align-top"
                                        style={{ lineHeight: '2rem' }} // Force alignment
                                        placeholder="Write details..."
                                    ></textarea>
                                </div>
                            </div>

                            {/* Update Button */}
                            <div className="flex justify-end mt-4">
                                <button
                                    type="submit"
                                    className="bg-[#1e293b] text-white px-6 py-3 rounded shadow-lg flex items-center gap-2 font-sans font-medium text-sm hover:bg-[#0f172a] transition-all transform hover:scale-105"
                                >
                                    <Save size={18} /> Update Task Entry
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ToDoList;
