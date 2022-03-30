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

  /* POST new bill integration test */

  describe("When I submit a complete form", () => {
    test("Then I should go on Bills page", () => {

      // Build user interface
      const html = NewBillUI();
      document.body.innerHTML = html;

      // Init a new bill
      const newbill = new NewBill({document, onNavigate, store, localStorage});
      
      // Mock handleSubmit function
      const handleSubmit = jest.fn(() => newbill.handleSubmit);

      // Mock handleChangeFile function
      const handleChangeFile = jest.fn(() => newbill.handleChangeFile);

      // Get DOM elements
      const form = screen.getByTestId('form-new-bill');
      
      const expenseType = screen.getByTestId('expense-type');
      const expenseName = screen.getByTestId('expense-name');
      const datePicker = screen.getByTestId('datepicker');
      const amount = screen.getByTestId('amount');
      const vat = screen.getByTestId('vat');
      const pct = screen.getByTestId('pct');
      const commentary = screen.getByTestId('commentary');
      const inputFileUser = screen.getByTestId('file');

      // Define new bill's data
      const newbilldata = {
        'type': 'Restaurants et bars',
        'name': 'Restaurant du lac',
        'date': '2002-02-02',
        'amount': 100,
        'vat': 20,
        'pct': 20,
        'commentary': 'test',
        'fileName': 'test_file.jpeg'
      };

      // Event and fire
      fireEvent.change(expenseType, {target: {value: newbilldata.type}})
      fireEvent.change(expenseName, {target: {value: newbilldata.name}})
      fireEvent.change(datePicker, {target: {value: newbilldata.date}})
      fireEvent.change(amount, {target: {value: newbilldata.amount}})
      fireEvent.change(vat, {target: {value: newbilldata.vat}})
      fireEvent.change(pct, {target: {value: newbilldata.pct}})
      fireEvent.change(commentary, {target: {value: newbilldata.commentary}})

      inputFileUser.addEventListener('change', handleChangeFile);
      fireEvent.change(inputFileUser, {
        target: {
          files: [new File(['test_file.jpeg'], 'test_file.jpeg')],
        },
      });

      form.addEventListener('submit', handleSubmit);
      fireEvent.submit(form);

      // handleSubmit function must have been called
      expect(handleSubmit).toHaveBeenCalled();
      // I should go on Bills page
      expect(screen.getByText('Mes notes de frais')).toBeTruthy();
    });
  });

  describe("When an error occurs on API", () => {
    beforeEach(() => {
      jest.spyOn(mockStore, "bills");

      // Spy and mock console error
      jest.spyOn(console, 'error').mockImplementation(() => {});

      // Build user interface
      const html = NewBillUI();
      document.body.innerHTML = html;
    });
    afterEach(() => {
      console.error.mockClear();
    });
    test("fetches bills from an API and fails with 404 message error", async () => {
      
      mockStore.bills.mockImplementationOnce(() => {
        return {
          update : () =>  {
            return Promise.reject(new Error("Erreur 404"));
          }
        }
      });
      
      // Init a new bill
      const newbill = new NewBill({document, onNavigate, store, localStorage});
      
      // Mock handleSubmit function
      const handleSubmit = jest.fn(() => newbill.handleSubmit);

      // Get DOM elements
      const form = screen.getByTestId('form-new-bill');

      // Event and fire
      form.addEventListener('submit', handleSubmit);
      fireEvent.submit(form);

      // NodeJS process (Event Loop queue)
      await new Promise(process.nextTick);

      // Console error should have been called
      expect(console.error).toHaveBeenCalled();
      // Console error should contain error 404 message
      expect(console.error.mock.calls[0][0].toString()).toContain('Erreur 404');
    });
    test("fetches bills from an API and fails with 500 message error", async () => {
      
      mockStore.bills.mockImplementationOnce(() => {
        return {
          update : () =>  {
            return Promise.reject(new Error("Erreur 500"));
          }
        }
      });
      
      // Init a new bill
      const newbill = new NewBill({document, onNavigate, store, localStorage});
      
      // Mock handleSubmit function
      const handleSubmit = jest.fn(() => newbill.handleSubmit);

      // Get DOM elements
      const form = screen.getByTestId('form-new-bill');

      // Event and fire
      form.addEventListener('submit', handleSubmit);
      fireEvent.submit(form);

      // NodeJS process (Event Loop queue)
      await new Promise(process.nextTick);

      // Console error should have been called
      expect(console.error).toHaveBeenCalled();
      // Console error should contain error 500 message
      expect(console.error.mock.calls[0][0].toString()).toContain('Erreur 500');
    });
  });
});