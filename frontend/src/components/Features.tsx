import React, { useId } from "react";
import { motion, useInView } from "framer-motion";
import {
  Users,
  Activity,
  BarChart3,
  CheckSquare,
  Zap,
  Clock,
} from "lucide-react";

interface Feature {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  gradient: string;
}

interface TaskManagementFeaturesProps {
  features?: Feature[];
  title?: string;
  subtitle?: string;
}

const Grid = ({ pattern, size }: { pattern?: number[][]; size?: number }) => {
  const p = pattern ?? [
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
  ];
  return (
    <div className="pointer-events-none absolute left-1/2 top-0 -ml-20 -mt-2 h-full w-full [mask-image:linear-gradient(white,transparent)]">
      <div className="absolute inset-0 bg-gradient-to-r [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:from-zinc-900/30 from-zinc-100/30 to-zinc-300/30 dark:to-zinc-900/30 opacity-100">
        <GridPattern
          width={size ?? 20}
          height={size ?? 20}
          x="-12"
          y="4"
          squares={p}
          className="absolute inset-0 h-full w-full mix-blend-overlay dark:fill-white/10 dark:stroke-white/10 stroke-black/10 fill-black/10"
        />
      </div>
    </div>
  );
};

function GridPattern({ width, height, x, y, squares, ...props }: any) {
  const patternId = useId();

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        strokeWidth={0}
        fill={`url(#${patternId})`}
      />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([x, y]: any) => (
            <rect
              strokeWidth="0"
              key={`${x}-${y}`}
              width={width + 1}
              height={height + 1}
              x={x * width}
              y={y * height}
            />
          ))}
        </svg>
      )}
    </svg>
  );
}

const InView = ({
  children,
  variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  transition = { duration: 0.6 },
  viewOptions = { once: true, margin: "0px 0px -100px 0px" },
}: {
  children: React.ReactNode;
  variants?: any;
  transition?: any;
  viewOptions?: any;
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, viewOptions);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      transition={transition}
    >
      {children}
    </motion.div>
  );
};

const FeatureCard = ({
  feature,
  index,
}: {
  feature: Feature;
  index: number;
}) => {
  const IconComponent = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{
        scale: 1.02,
        y: -5,
        transition: { duration: 0.2 },
      }}
      className="group relative bg-gradient-to-b dark:from-neutral-900 from-neutral-50 dark:to-neutral-950 to-white p-8 rounded-2xl overflow-hidden border border-border/50 hover:border-border transition-all duration-300"
      viewport={{ once: true }}
    >
      <Grid size={20} />

      <div className="relative z-20">
        <div className={`inline-flex p-3 rounded-xl ${feature.gradient} mb-6`}>
          <IconComponent className="w-6 h-6 text-white" />
        </div>

        <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-blue-600 transition-colors">
          {feature.title}
        </h3>

        <p className="text-muted-foreground leading-relaxed">
          {feature.description}
        </p>
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-blue-800/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
};

const Features = () => {
  const features: Feature[] = [
    {
      title: "Team Collaboration",
      description:
        "Work seamlessly with your team members in real-time. Share tasks, communicate instantly, and keep everyone aligned on project goals.",
      icon: Users,
      gradient: "bg-gradient-to-br from-blue-500 to-blue-600",
    },
    {
      title: "Real-time Updates",
      description:
        "Stay informed with instant notifications and live updates. Never miss important changes or deadlines with our real-time sync technology.",
      icon: Activity,
      gradient: "bg-gradient-to-br from-green-500 to-emerald-600",
    },
    {
      title: "Advanced Analytics",
      description:
        "Gain deep insights into your team's productivity and project progress with comprehensive analytics and detailed reporting tools.",
      icon: BarChart3,
      gradient: "bg-gradient-to-br from-blue-600 to-blue-800",
    },
    {
      title: "Smart Task Tracking",
      description:
        "Organize, prioritize, and track tasks with intelligent automation. Set dependencies, deadlines, and get AI-powered suggestions.",
      icon: CheckSquare,
      gradient: "bg-gradient-to-br from-orange-500 to-red-500",
    },
    {
      title: "Lightning Fast",
      description:
        "Experience blazing-fast performance with optimized workflows. Our platform is built for speed and efficiency at scale.",
      icon: Zap,
      gradient: "bg-gradient-to-br from-yellow-500 to-orange-500",
    },
    {
      title: "Time Management",
      description:
        "Track time spent on tasks, set estimates, and optimize your workflow. Built-in time tracking helps you stay productive.",
      icon: Clock,
      gradient: "bg-gradient-to-br from-indigo-500 to-blue-600",
    },
  ];

  return (
    <section id="features" className="py-20 lg:py-32 bg-background">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl lg:text-5xl font-bold text-foreground mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Powerful Features for Modern Teams
          </motion.h2>
          <motion.p
            className="text-xl text-muted-foreground leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Everything you need to manage tasks efficiently and collaborate
            seamlessly with your team.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl"
          >
            Get Started Today
            <Zap className="ml-2 w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
