import React from "react";
import { orderId, STATUS_CONFIG } from "../utils";

export default function StatusModal({ order, onSave, onClose, ALL_STATUSES }) {
  const [selected, setSelected] = React.useState(order.status);
  const PIPELINE = ["Pending", "Processing", "Delivered"];
  const currentStep = PIPELINE.indexOf(order.status);

  return (
    <div className="fixed h-full inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-[#1e2a3a]">Update Status</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Order{" "}
              <span className="text-[#f97316] font-semibold">
                #{orderId(order)}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-5 h-5"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {order.status !== "Cancelled" && (
          <div className="flex items-center mb-6 px-1">
            {PIPELINE.map((step, i) => {
              const done = currentStep >= i;
              const current = currentStep === i;
              return (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                        done
                          ? "bg-[#f97316] border-[#f97316] text-white"
                          : "bg-white border-gray-200 text-gray-300"
                      } ${current ? "ring-4 ring-[#f97316]/20" : ""}`}
                    >
                      {done && !current ? (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={3}
                          className="w-3.5 h-3.5"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        i + 1
                      )}
                    </div>
                    <span
                      className={`text-[10px] font-medium whitespace-nowrap ${done ? "text-[#f97316]" : "text-gray-300"}`}
                    >
                      {step}
                    </span>
                  </div>
                  {i < PIPELINE.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-1 mb-4 rounded ${currentStep > i ? "bg-[#f97316]" : "bg-gray-200"}`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}

        <div className="space-y-2 mb-5">
          {ALL_STATUSES.map((status) => {
            const cfg = STATUS_CONFIG[status];
            return (
              <button
                key={status}
                onClick={() => setSelected(status)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                  selected === status
                    ? "border-[#f97316] bg-[#f97316]/5"
                    : "border-gray-100 hover:border-gray-200 bg-gray-50"
                }`}
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${cfg.dot}`}
                />
                <span className="flex-1 text-left text-[#1e2a3a]">
                  {status}
                </span>
                {selected === status && (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth={2.5}
                    className="w-4 h-4"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(selected)}
            disabled={selected === order.status}
            className="flex-1 py-2.5 rounded-xl bg-[#f97316] hover:bg-[#ea6c0a] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors shadow-[0_4px_12px_rgba(249,115,22,0.3)]"
          >
            Save Status
          </button>
        </div>
      </div>
    </div>
  );
}
