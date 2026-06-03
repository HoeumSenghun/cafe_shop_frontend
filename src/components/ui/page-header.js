export default function PageHeader ({
  title,
  subtitle,
  children,
  className = ''
}) {
  return (
    <header className={`mb-6 sm:mb-8 ${className}`.trim()}>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div className='min-w-0'>
          <h1 className='text-2xl sm:text-3xl lg:text-4xl'>{title}</h1>
          {subtitle && (
            <p className='mt-2 max-w-2xl text-sm leading-relaxed text-muted sm:text-base'>
              {subtitle}
            </p>
          )}
        </div>
        {children && (
          <div className='flex shrink-0 flex-wrap items-center gap-2'>
            {children}
          </div>
        )}
      </div>
    </header>
  )
}
