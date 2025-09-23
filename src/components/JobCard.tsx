import { Link } from 'react-router-dom';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  imageUrl: string;
  postedAt: string;
  salaryRange?: string;
}

interface JobCardProps {
  job: Job;
  className?: string;
}

export function JobCard({ job, className = '' }: JobCardProps) {
  return (
    <Link 
      to={`/banen/${job.id}`}
      className={`block group h-full ${className}`}
    >
      <article className="card-animation h-full bg-card border border-border hover:border-muted-foreground/20 rounded-lg overflow-hidden group transition-all duration-200">
        {/* Image */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={job.imageUrl}
            alt={`${job.title} bij ${job.company}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col justify-between h-[calc(100%-theme(spacing.40))]">
          {/* Meta */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span>{job.location}</span>
            <span>•</span>
            <span>Banen</span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-foreground leading-tight line-clamp-2 mb-2 group-hover:text-primary transition-colors duration-200">
            {job.title}
          </h3>

          {/* Company & Salary */}
          <div className="flex flex-col gap-1">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {job.company}
            </p>
            {job.salaryRange && (
              <p className="text-sm text-accent font-medium">
                {job.salaryRange}
              </p>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}