/**
 * @jest-environment jsdom
 */

import { fireEvent, screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES, ROUTES_PATH } from '../constants/routes';
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"
import router from "../app/Router.js";

// Mock - parameters for bdd
jest.mock("../app/store", () => mockStore);

// Init localStorage
Object.defineProperty(window, 'localStorage', { value: localStorageMock });
window.localStorage.setItem('user', JSON.stringify({
  type: 'Employee'
}));

// Init onNavigate and store
const onNavigate = (pathname) => {
  document.body.innerHTML = ROUTES({ pathname })
};
const store = mockStore;

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page and upload a file with an extension other than .jpg, .jpeg or .png", () => {
    test("Then I cannot submit form and have an error message about file uploaded", () => {

      // Build user interface
      const html = NewBillUI();
      document.body.innerHTML = html;

      // Init a new bill
      const newbill = new NewBill({document, onNavigate, store, localStorage});

      // Mock handleChangeFile function
      const handleChangeFile = jest.fn(() => newbill.handleChangeFile);

      // Get DOM elements
      const inputFileUser = screen.getByTestId("file");
      const submitbtn = document.getElementById('btn-send-bill');
      const errorMessage = document.getElementById('file-error-message')

      // Event and fire
      inputFileUser.addEventListener('change', handleChangeFile);
      fireEvent.change(inputFileUser, {
        target: {
          files: [new File(['test_file.doc'], 'test_file.doc')],
        },
      });

      // handleChangeFile function must be called
      expect(handleChangeFile).toBeCalled();
      // display an error message
      expect(errorMessage.classList.contains('hidden')).toBe(false);
      // Submit button is disabled
      expect(submitbtn.hasAttribute('disabled')).toBe(true);
    })
  })
})