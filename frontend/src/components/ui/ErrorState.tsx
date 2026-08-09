interface ErrorStateProps {
  title?: string;
  message?: string;
}

const ErrorState = ({ title = 'Something went wrong', message = 'Please try again shortly.' }: ErrorStateProps) => {
  return (
    <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-rose-100/80">{message}</p>
    </div>
  );
};

export default ErrorState;
