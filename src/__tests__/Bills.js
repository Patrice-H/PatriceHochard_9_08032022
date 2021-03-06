/**
 * @jest-environment jsdom
 */

import {screen, waitFor, fireEvent} from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import Bills from "../containers/Bills.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES_PATH, ROUTES} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import router from "../app/Router.js";

jest.mock("../app/store", () => mockStore);

describe("Given I am connected as an employee", () => {

  /* BillsUI tests suite */
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }));
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId('icon-window'));
      const windowIcon = screen.getByTestId('icon-window');
      expect(windowIcon.classList.contains('active-icon')).toBe(true);
    });

    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML);
      const antiChrono = (a, b) => ((a < b) ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });
  });

  /* Bills tests suite */
  // handleClickNewBill function unit test
  describe("When I am on Bills Page and I click on the New Bill button", () => {
    test("Then, it should render NewBill page", () => {
      // Init localStorage
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }));

      // Init onNavigate and store
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      }
      const store = null;

      // Build user interface
      document.body.innerHTML = BillsUI({ data: bills });
      
      // Init bills
      const allBills = new Bills({
        document,
        onNavigate,
        store,
        localStorage: window.localStorage,
      });

      // Mock handleClickNewBill function
      const handleClickNewBill = jest.fn(allBills.handleClickNewBill);

      // Get DOM element
      const billBtn = screen.getByTestId('btn-new-bill');

      // Add event and fire
      billBtn.addEventListener('click', handleClickNewBill);
      fireEvent.click(billBtn);

      // handleClickNewBill function must be called
      expect(handleClickNewBill).toBeCalled();
      // screen should show "Envoyer une note de frais"
      expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy();
    });
  });

  // handleClickIconEye function unit test
  describe("When I am on Bills Page and I click on the icon eye", () => {
    test("Then the modal should open up", () => {

      // Init localStorage
      Object.defineProperty(window, 'localStorage', { value: localStorageMock });
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }));

      // Init onNavigate and store
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const store = null;
      
      // Build user interface
      document.body.innerHTML = BillsUI({ data: bills });
      
      // Init bills
      const allBills = new Bills({
        document,
        onNavigate,
        store,
        localStorage: window.localStorage,
      });
      
      // Get DOM eye button element
      const eye = screen.getAllByTestId('icon-eye')[0];

      // Mock modal comportment
      $.fn.modal = jest.fn();

      // Mock handleClickIconEye function
      const handleClickIconEye = jest.fn(allBills.handleClickIconEye);

      // Add event and fire
      eye.addEventListener('click', handleClickIconEye(eye));
      fireEvent.click(eye);

      // Get DOM modal element
      const modale = screen.getByText('Justificatif');

      // handleClickIconEye function must be called
      expect(handleClickIconEye).toHaveBeenCalled();
      // The modal should open up
      expect(modale).toBeTruthy();
    });
  });

  // getBills function integration tests
  describe("When I navigate to bills page", () => {
    test("fetches bills from mock API GET", async () => {
      const spy = jest.spyOn(mockStore, "bills");
      const bills = await mockStore.bills().list();

      localStorage.setItem('user', JSON.stringify({ type: 'Employee', email: 'e@e' }));
      const root = document.createElement('div');
      root.setAttribute('id', 'root');
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);

      await waitFor(() => screen.getByText('Mes notes de frais'));
      const billPending  = screen.getByText('encore');
      const billRefused  = screen.getByText('test1');
      const billAccepted = screen.getByText('test3');

      expect(spy).toHaveBeenCalled();
      expect(bills.length).toBe(4);
      expect(billPending).toBeTruthy();
      expect(billRefused).toBeTruthy();
      expect(billAccepted).toBeTruthy();
    });
  });
  
  describe("When an error occurs on API", () => {

    beforeEach(() => {
      jest.spyOn(mockStore, "bills");
      Object.defineProperty(
          window,
          'localStorage',
          { value: localStorageMock }
      );
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: "e@e"
      }));
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.appendChild(root);
      router();
    });

    test("fetches bills from an API and fails with 404 message error", async () => {

      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 404"));
          }
        }
      });
      window.onNavigate(ROUTES_PATH.Bills);
      await new Promise(process.nextTick);
      const message = screen.getByText(/Erreur 404/);
      expect(message).toBeTruthy();
    });

    test("fetches messages from an API and fails with 500 message error", async () => {

      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 500"));
          }
        }
      });

      window.onNavigate(ROUTES_PATH.Bills);
      await new Promise(process.nextTick);
      const message = screen.getByText(/Erreur 500/);
      expect(message).toBeTruthy();
    });
  });
});