"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useRef,
  useEffect,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence } from "motion/react";
import { useScrollLock } from "@/app/hooks/useScrollLock";
import { useFocusTrap } from "@/app/hooks/useFocusTrap";
import { ModalBackdrop } from "./ModalBackdrop";
import { ModalContent } from "./ModalContent";

type QuickViewState = {
  isOpen: boolean;
  productHandle: string | null;
  triggerRef: React.RefObject<HTMLButtonElement | null> | null;
};

type QuickViewAction =
  | {
      type: "OPEN";
      handle: string;
      triggerRef: React.RefObject<HTMLButtonElement | null>;
    }
  | { type: "CLOSE" };

const initialState: QuickViewState = {
  isOpen: false,
  productHandle: null,
  triggerRef: null,
};

const quickViewReducer = (
  state: QuickViewState,
  action: QuickViewAction,
): QuickViewState => {
  switch (action.type) {
    case "OPEN":
      return {
        isOpen: true,
        productHandle: action.handle,
        triggerRef: action.triggerRef,
      };
    case "CLOSE":
      return { ...state, isOpen: false };
    default:
      return state;
  }
};

type QuickViewContextValue = {
  state: QuickViewState;
  open: (
    handle: string,
    triggerRef: React.RefObject<HTMLButtonElement | null>,
  ) => void;
  close: () => void;
};

const QuickViewContext = createContext<QuickViewContextValue | null>(null);

export const useQuickView = () => {
  const context = useContext(QuickViewContext);
  if (!context) {
    throw new Error("useQuickView must be used within QuickViewProvider");
  }
  return context;
};

const QuickViewModal = () => {
  const { state, close } = useQuickView();
  const dialogRef = useRef<HTMLDivElement>(null);

  useScrollLock(state.isOpen);
  useFocusTrap({
    containerRef: dialogRef,
    isActive: state.isOpen,
    returnFocusRef: state.triggerRef ?? undefined,
  });

  useEffect(() => {
    if (!state.isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [close, state.isOpen]);

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {state.isOpen && (
        <>
          <ModalBackdrop onClose={close} />
          <ModalContent
            ref={dialogRef}
            onClose={close}
            productHandle={state.productHandle}
          />
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export const QuickViewProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(quickViewReducer, initialState);

  const open = useCallback(
    (
      handle: string,
      triggerRef: React.RefObject<HTMLButtonElement | null>,
    ) => {
      dispatch({ type: "OPEN", handle, triggerRef });
    },
    [],
  );

  const close = useCallback(() => {
    dispatch({ type: "CLOSE" });
  }, []);

  const value = useMemo(
    () => ({
      state,
      open,
      close,
    }),
    [state, open, close],
  );

  return (
    <QuickViewContext.Provider value={value}>
      {children}
      <QuickViewModal />
    </QuickViewContext.Provider>
  );
};
