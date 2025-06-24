"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Plus, X, Check, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Task } from "@/models/task";

interface Props {
  tasks: Task[];
  onAdd: (title: string) => void;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function DynamicIslandTodo({ tasks, onAdd, onToggle, onDelete }: Props) {
  const [newTodo, setNewTodo] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addTodo = () => {
    if (newTodo.trim() !== "") {
      onAdd(newTodo.trim());
      setNewTodo("");
    }
  };

  const sortedTodos = [...tasks].sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1;
  });

  const completedTodos = tasks.filter((todo) => todo.completed).length;
  const remainingTodos = tasks.length - completedTodos;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isExpanded && !(event.target as Element).closest(".dynamic-island-todo")) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded]);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") addTodo();
  };

  return (
    <motion.div
      className="dynamic-island-todo"
      initial={false}
      animate={{
        width: isExpanded ? "var(--di-expanded-width)" : "var(--di-collapsed-width)",
        height: isExpanded ? "auto" : "var(--di-collapsed-height)",
        borderRadius: isExpanded ? "var(--di-expanded-radius)" : "var(--di-border-radius)",
      }}
      transition={{ type: "spring", stiffness: 500, damping: 30, mass: 1 }}
    >
      <motion.div className="bg-black text-white h-full overflow-hidden rounded-[inherit] border border-gray-800">
        {!isExpanded ? (
          <motion.div
            className="p-2 flex items-center justify-between h-full cursor-pointer"
            onClick={() => setIsExpanded(true)}
          >
            <span className="text-xs text-gray-400 pl-2">Add a new task...</span>
            <div className="flex items-center space-x-2 h-full">
              {remainingTodos > 0 && (
                <span className="bg-yellow-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
                  {remainingTodos}
                </span>
              )}
              {completedTodos > 0 && (
                <span className="bg-gray-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
                  {completedTodos}
                </span>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div className="p-4 pb-2">
            <div className="flex mb-4 items-center">
              <div className="flex-grow relative mr-2">
                <Input
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="What's next on your list?"
                  className="w-full bg-[#111] border-[#222] text-gray-200 placeholder:text-gray-500 focus:border-[#333] h-10 pl-10 rounded-lg"
                  ref={inputRef}
                />
                <Pencil className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
              <Button onClick={addTodo} className="bg-[#111] hover:bg-[#222] text-gray-400 hover:text-gray-200 border border-[#222] rounded-lg">
                <Plus size={16} />
              </Button>
            </div>
            <motion.ul className="space-y-2 max-h-[20rem] overflow-y-auto">
              <AnimatePresence>
                {sortedTodos.map((todo) => (
                  <motion.li
                    key={todo.id}
                    className="flex items-center justify-between"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <span
                      className={`flex-grow text-sm text-left transition-all ${
                        todo.completed ? "text-gray-500 line-through" : "text-yellow-500"
                      }`}
                    >
                      {todo.title}
                    </span>
                    <div className="flex items-center bg-[#111] rounded-md border border-[#222]">
                      <Button onClick={() => onToggle(todo.id)} size="sm" variant="ghost" className="h-10 px-3 text-gray-400 hover:text-black cursor-pointer">
                        {todo.completed ? <RotateCcw size={14} /> : <Check size={14} />}
                      </Button>
                      <Separator orientation="vertical" className="h-5 bg-[#222]" />
                      <Button onClick={() => onDelete(todo.id)} size="sm" variant="ghost" className="h-10 px-3 text-gray-400 hover:text-black cursor-pointer">
                        <X size={14} />
                      </Button>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
