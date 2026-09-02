type ErrorBannerProps = {
  message: string;
};

export const ErrorBanner = ({ message }: ErrorBannerProps) => {
  return (
    <div className="error-banner" role="alert">
      {message}
    </div>
  );
};
