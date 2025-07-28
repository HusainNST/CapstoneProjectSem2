interface EmptyStateProps {
  message: string;
  submessage?: string;
  icon?: string;
}

export default function EmptyState({ message, submessage, icon }: EmptyStateProps) {
  return (
    <div className="text-center py-8">
      {icon && <div className="text-4xl mb-4">{icon}</div>}
      <div className="text-2xl text-gray-600">{message}</div>
      {submessage && <p className="mt-2">{submessage}</p>}
    </div>
  );
}
