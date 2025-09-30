// 브라우저 확장 프로그램에서 발생하는 runtime.lastError 무시
export function suppressRuntimeErrors() {
  if (typeof window === 'undefined') return

  // console.error 오버라이드
  const originalConsoleError = console.error
  console.error = (...args) => {
    const errorMessage = args.join(' ')

    // 브라우저 확장 프로그램 관련 에러들 무시
    const shouldSuppressError = [
      'runtime.lastError',
      'message channel closed',
      'A listener indicated an asynchronous response',
      'Unchecked runtime.lastError',
      'Extension context invalidated',
      'Could not establish connection'
    ].some(pattern => errorMessage.includes(pattern))

    if (shouldSuppressError) {
      // 이러한 에러들은 콘솔에 출력하지 않음
      return
    }

    // 다른 에러들은 정상적으로 출력
    originalConsoleError.apply(console, args)
  }

  // 전역 에러 핸들러
  window.addEventListener('error', (event) => {
    const errorMessage = event.message || event.error?.message || ''

    if (
      errorMessage.includes('runtime.lastError') ||
      errorMessage.includes('message channel closed') ||
      errorMessage.includes('A listener indicated an asynchronous response')
    ) {
      event.preventDefault()
      return false
    }
  })

  // Promise rejection 핸들러
  window.addEventListener('unhandledrejection', (event) => {
    const errorMessage = event.reason?.message || event.reason || ''

    if (
      errorMessage.includes('runtime.lastError') ||
      errorMessage.includes('message channel closed') ||
      errorMessage.includes('A listener indicated an asynchronous response')
    ) {
      event.preventDefault()
      return false
    }
  })
}

// 에러 억제 해제 함수
export function restoreConsoleError() {
  if (typeof window === 'undefined') return

  // 원본 console.error 복원이 필요한 경우 사용
  // 하지만 대부분의 경우 페이지 새로고침 시 자동으로 복원됨
}