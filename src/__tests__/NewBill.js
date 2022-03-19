/**
 * @jest-environment jsdom
 */

import { fireEvent, screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES } from '../constants/routes';
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"

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

describe("Given I am connected as an employee and I am on NewBill Page", () => {

  describe("When I upload a .jpg file", () => {
    test("Then I can submit form and have not error message", () => {
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
      const errorMessage = screen.getByText('Format de fichier invalide');

      // Event and fire
      inputFileUser.addEventListener('change', handleChangeFile);
      fireEvent.change(inputFileUser, {
        target: {
          files: [new File(['test_file.jpg'], 'test_file.jpg')],
        },
      });

      // handleChangeFile function must be called
      expect(handleChangeFile).toBeCalled();
      // hide the error message
      expect(errorMessage.classList.contains('hidden')).toBe(true);
      // Submit button is enabled
      expect(submitbtn.hasAttribute('disabled')).toBe(false);
    });
  });

  describe("When I upload a .jpeg file", () => {
    test("Then I can submit form and have not error message", () => {
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
      const errorMessage = screen.getByText('Format de fichier invalide');

      // Event and fire
      inputFileUser.addEventListener('change', handleChangeFile);
      fireEvent.change(inputFileUser, {
        target: {
          files: [new File(['test_file.jpeg'], 'test_file.jpeg')],
        },
      });

      // handleChangeFile function must be called
      expect(handleChangeFile).toBeCalled();
      // display not error message
      expect(errorMessage.classList.contains('hidden')).toBe(true);
      // Submit button is enabled
      expect(submitbtn.hasAttribute('disabled')).toBe(false);
    });
  });

  describe("When I upload a .png file", () => {
    test("Then I can submit form and have not error message", () => {
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
      const errorMessage = screen.getByText('Format de fichier invalide');

      // Event and fire
      inputFileUser.addEventListener('change', handleChangeFile);
      fireEvent.change(inputFileUser, {
        target: {
          files: [new File(['test_file.png'], 'test_file.png')],
        },
      });

      // handleChangeFile function must be called
      expect(handleChangeFile).toBeCalled();
      // display not error message
      expect(errorMessage.classList.contains('hidden')).toBe(true);
      // Submit button is enabled
      expect(submitbtn.hasAttribute('disabled')).toBe(false);
    });
  });

  describe("When I upload a file with an extension other than .jpg, .jpeg or .png", () => {
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
      const errorMessage = screen.getByText('Format de fichier invalide');

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
    });
  });
});