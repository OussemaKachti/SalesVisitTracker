interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: Array<{ id: number; title: string; icon: string }>;
}

const StepIndicator = ({ currentStep, totalSteps, steps }: StepIndicatorProps) => {
  return (
    <div className="relative">
      {/* Progress Bar Background */}
      <div className="absolute top-6 left-0 right-0 h-1 bg-gradient-to-r from-muted via-muted to-muted">
        <div
          className="h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-700 ease-out"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />
      </div>

      {/* Steps */}
      <div className="relative flex justify-between">
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center">
            <div
              className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 transform ${
                step.id < currentStep
                  ? 'bg-gradient-to-br from-primary to-secondary scale-100 shadow-glow'
                  : step.id === currentStep
                  ? 'bg-gradient-to-br from-secondary to-accent scale-110 shadow-glow-lg animate-pulse-subtle'
                  : 'bg-muted scale-90'
              }`}
            >
              {step.id < currentStep ? (
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <span
                  className={`text-lg font-display font-bold ${
                    step.id === currentStep ? 'text-white' : 'text-muted-foreground'
                  }`}
                >
                  {step.id}
                </span>
              )}
            </div>
            <p
              className={`mt-3 text-sm font-cta font-medium transition-colors duration-300 ${
                step.id === currentStep
                  ? 'text-foreground'
                  : step.id < currentStep
                  ? 'text-primary' :'text-muted-foreground'
              }`}
            >
              {step.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;