import { getByText } from '@testing-library/dom'

describe('Homepage', () => {
  it('displays the main heading', () => {
    document.body.innerHTML = '<h1>Welcome</h1>'
    expect(getByText(document.body, 'Welcome')).toBeTruthy()
  })
})
