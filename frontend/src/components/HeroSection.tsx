"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Users,
  Calendar,
  BarChart3,
  ArrowRight,
  Play,
  Zap,
  Target,
  Clock,
  TrendingUp,
} from "lucide-react";

import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

interface TaskItem {
  id: number;
  title: string;
  completed: boolean;
  assignee: string;
  priority: "high" | "medium" | "low";
}

interface MetricItem {
  label: string;
  value: string;
  change: string;
  icon: React.ReactNode;
}

interface FeatureHighlight {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const TaskDemo: React.FC = () => {
  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      id: 1,
      title: "Design new dashboard",
      completed: false,
      assignee: "Sarah",
      priority: "high",
    },
    {
      id: 2,
      title: "Review user feedback",
      completed: false,
      assignee: "Mike",
      priority: "medium",
    },
    {
      id: 3,
      title: "Update documentation",
      completed: false,
      assignee: "Alex",
      priority: "low",
    },
  ]);

  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTasks((prev) => {
        const newTasks = [...prev];
        if (currentTaskIndex < newTasks.length) {
          newTasks[currentTaskIndex] = {
            ...newTasks[currentTaskIndex],
            completed: true,
          };
          setCurrentTaskIndex((prev) => prev + 1);
        }
        return newTasks;
      });
    }, 2000);

    const resetInterval = setInterval(() => {
      setTasks((prev) => prev.map((task) => ({ ...task, completed: false })));
      setCurrentTaskIndex(0);
    }, 8000);

    return () => {
      clearInterval(interval);
      clearInterval(resetInterval);
    };
  }, [currentTaskIndex]);

  return (
    <div className="relative overflow-hidden">
      {/* Enhanced Card with better background and effects */}
      <Card className="relative p-6 bg-gradient-to-br from-white via-blue-50/50 to-blue-100/30 dark:from-gray-900 dark:via-blue-950/30 dark:to-blue-900/20 border border-blue-200/50 dark:border-blue-800/30 shadow-xl backdrop-blur-sm">
        {/* Background pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_70%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_70%)]" />

        {/* Subtle animated background dots */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-4 left-8 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          <div
            className="absolute top-12 right-12 w-1 h-1 bg-blue-300 rounded-full animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute bottom-8 left-16 w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"
            style={{ animationDelay: "2s" }}
          />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              Today's Tasks
            </h3>
            <div className="ml-auto">
              <Badge className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700 font-semibold">
                {tasks.filter((task) => task.completed).length}/{tasks.length}{" "}
                Done
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            {tasks.map((task, index) => (
              <motion.div
                key={task.id}
                className="group relative flex items-center gap-4 p-4 rounded-xl bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/30 hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

                <motion.div
                  className="relative z-10"
                  animate={{
                    scale: task.completed ? 1.2 : 1,
                    rotate: task.completed ? 360 : 0,
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <CheckCircle
                    className={`w-6 h-6 transition-colors duration-300 ${
                      task.completed
                        ? "text-green-500 drop-shadow-sm"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                  />
                </motion.div>

                <div className="flex-1 relative z-10">
                  <p
                    className={`text-base font-semibold transition-all duration-300 ${
                      task.completed
                        ? "line-through text-gray-500 dark:text-gray-400"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {task.title}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {task.assignee}
                    </span>
                    <Badge
                      variant={
                        task.priority === "high"
                          ? "destructive"
                          : task.priority === "medium"
                          ? "default"
                          : "secondary"
                      }
                      className="text-xs font-bold shadow-sm"
                    >
                      {task.priority}
                    </Badge>
                  </div>
                </div>

                {/* Task completion indicator */}
                {task.completed && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <CheckCircle className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="mt-6 p-4 rounded-xl bg-gray-50/80 dark:bg-gray-800/30 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Progress
              </span>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                {Math.round(
                  (tasks.filter((task) => task.completed).length /
                    tasks.length) *
                    100
                )}
                %
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-inner"
                initial={{ width: 0 }}
                animate={{
                  width: `${
                    (tasks.filter((task) => task.completed).length /
                      tasks.length) *
                    100
                  }%`,
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

const ProductivityMetrics: React.FC = () => {
  const [metrics] = useState<MetricItem[]>([
    {
      label: "Tasks Completed",
      value: "247",
      change: "+12%",
      icon: <Target className="w-4 h-4" />,
    },
    {
      label: "Team Efficiency",
      value: "94%",
      change: "+8%",
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      label: "Time Saved",
      value: "15h",
      change: "+23%",
      icon: <Clock className="w-4 h-4" />,
    },
  ]);

  return (
    <Card className="p-6 bg-gradient-to-br from-white via-gray-50/50 to-blue-50/30 dark:from-gray-900 dark:via-gray-800/50 dark:to-blue-950/20 border border-gray-200/50 dark:border-gray-700/30 shadow-xl backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-foreground">This Week</h3>
      </div>
      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-600">
                {metric.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {metric.label}
                </p>
                <p className="text-xs text-muted-foreground">vs last week</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-foreground">
                {metric.value}
              </p>
              <p className="text-xs text-green-500">{metric.change}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

const TeamCollaboration: React.FC = () => {
  const [activeMembers] = useState([
    { name: "Sarah", avatar: "S", status: "online" },
    { name: "Mike", avatar: "M", status: "online" },
    { name: "Alex", avatar: "A", status: "away" },
    { name: "Emma", avatar: "E", status: "online" },
  ]);

  return (
    <Card className="p-6 bg-gradient-to-br from-white via-gray-50/50 to-green-50/30 dark:from-gray-900 dark:via-gray-800/50 dark:to-green-950/20 border border-gray-200/50 dark:border-gray-700/30 shadow-xl backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-foreground">Team Activity</h3>
      </div>
      <div className="space-y-3">
        {activeMembers.map((member, index) => (
          <motion.div
            key={member.name}
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 text-white flex items-center justify-center text-sm font-medium">
                {member.avatar}
              </div>
              <div
                className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
                  member.status === "online" ? "bg-green-500" : "bg-yellow-500"
                }`}
              />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {member.name}
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                {member.status}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

const HeroSection: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features: FeatureHighlight[] = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Complete tasks 3x faster with our intelligent automation",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Team Collaboration",
      description: "Seamlessly work together with real-time updates",
      color: "from-blue-500 to-blue-700",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Smart Analytics",
      description: "Track progress with detailed insights and reports",
      color: "from-green-500 to-teal-500",
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-foreground">Loading amazing experience...</span>
        </motion.div>
      </div>
    );
  }

  return (
    <section className="relative min-h-screen pt-16 overflow-hidden">
      {/* Enhanced Background with multiple layers */}
      <div className="absolute inset-0">
        {/* Main gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-blue-950/20 dark:to-gray-800" />

        {/* Animated mesh gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.15),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(147,197,253,0.15),transparent_40%),radial-gradient(circle_at_40%_60%,rgba(96,165,250,0.1),transparent_50%)] animate-pulse" />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

        {/* Floating geometric shapes */}
        <motion.div
          className="absolute top-20 left-[10%] w-20 h-20 bg-gradient-to-r from-blue-400/20 to-blue-600/20 rounded-full blur-xl"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-40 right-[15%] w-32 h-32 bg-gradient-to-r from-blue-300/15 to-blue-500/15 rounded-full blur-2xl"
          animate={{
            y: [0, 30, 0],
            scale: [1, 0.8, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute bottom-40 left-[20%] w-24 h-24 bg-gradient-to-r from-blue-500/20 to-blue-700/20 rounded-full blur-xl"
          animate={{
            y: [0, -15, 0],
            x: [0, 10, 0],
            scale: [1, 1.2, 1],
            opacity: [0.25, 0.5, 0.25],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      {/* Content with improved spacing */}
      <div className="relative z-10 w-full min-h-screen">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-12 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center min-h-[calc(100vh-10rem)]">
            {/* Left Content - Full width utilization */}
            <motion.div
              className="space-y-8 lg:space-y-10"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Badge className="mb-6 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 px-4 py-2 text-sm font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/20">
                    ✨ New: AI-Powered Task Automation
                  </Badge>
                </motion.div>

                <motion.h1
                  className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="text-gray-900 dark:text-white">
                    Transform Your
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">
                    Team Productivity
                  </span>
                </motion.h1>

                <motion.p
                  className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Streamline workflows, boost collaboration, and achieve more
                  with our intelligent task management platform. Join 50,000+
                  teams already saving 15+ hours per week.
                </motion.p>
              </div>

              {/* Feature Highlights */}
              <motion.div
                className="grid md:grid-cols-3 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="p-5 rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 cursor-pointer transition-all duration-300 hover:shadow-xl"
                    whileHover={{
                      scale: 1.05,
                      y: -5,
                    }}
                    onHoverStart={() => setHoveredFeature(index)}
                    onHoverEnd={() => setHoveredFeature(null)}
                  >
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} p-3 text-white mb-4 shadow-lg`}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {feature.description}
                    </p>

                    <AnimatePresence>
                      {hoveredFeature === index && (
                        <motion.div
                          className="mt-3 text-sm text-blue-600 dark:text-blue-400 font-semibold"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          Learn more →
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-10 py-7 text-lg font-bold group shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  Start Free Trial
                  <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="px-10 py-7 text-lg font-semibold group border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                >
                  <Play className="mr-3 w-5 h-5 group-hover:scale-110 transition-transform" />
                  Watch Demo
                </Button>
              </motion.div>

              {/* Social Proof */}
              <motion.div
                className="flex items-center gap-6 pt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 border-4 border-white dark:border-gray-800 flex items-center justify-center text-white font-bold shadow-lg"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-base font-bold text-gray-900 dark:text-white">
                    Trusted by 50,000+ teams
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Average rating: 4.9/5 ⭐
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content - Interactive Demos with better spacing */}
            <motion.div
              className="lg:pl-8"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <TaskDemo />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <TeamCollaboration />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                  >
                    <ProductivityMetrics />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom CTA Section */}
      <motion.div
        className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <p className="text-2xl lg:text-3xl font-bold mb-2">
                Ready to boost your productivity?
              </p>
              <p className="text-blue-100 text-lg">
                Join thousands of teams already using our platform.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-bold shadow-xl cursor-pointer">
                Get Started Free
              </Button>
              <Button
                variant="outline"
                className="border-2 border-white text-blue-600 hover:bg-white hover:text-blue-700 px-8 py-4 text-lg font-semibold cursor-pointer"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
