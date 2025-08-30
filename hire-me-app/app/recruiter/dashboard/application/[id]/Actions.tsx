"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Check, X, Clock, FileCheck, AlertCircle, TrendingUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// import axios from "axios";

const updateApplicationStatus = async (
  applicationId: string,
  newStatus: string
) => {
  try {
    const res = await fetch("/api/application/status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        applicationId,
        status: newStatus,
      }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error updating application status:", error);
    return { success: false };
  }
};

const Actions = ({
  applicationId,
  jobId,
  status,
}: {
  applicationId: string;
  jobId: string;
  status: "Pending" | "Accepted" | "Rejected";
}) => {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [loading, setLoading] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [nextStatus, setNextStatus] = useState<
    "Pending" | "Accepted" | "Rejected" | null
  >(null);

  const handleConfirm = async () => {
    if (!nextStatus) return;

    try {
      setLoading(nextStatus);
      const res = await updateApplicationStatus(applicationId, nextStatus);

      if (res && typeof res === 'object' && 'success' in res && res.success) {
        setCurrentStatus(nextStatus);
        toast.success(`Application marked as ${nextStatus}`);
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
        console.log("Error updating status:", err);
      toast.error("Failed to update application status. Please try again");
    } finally {
      setLoading(null);
      setOpen(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Accepted":
        return <Check className="w-3 h-3" />;
      case "Rejected":
        return <X className="w-3 h-3" />;
      case "Pending":
        return <Clock className="w-3 h-3" />;
      default:
        return <FileCheck className="w-3 h-3" />;
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case "Accepted":
        return "This application has been approved and the candidate will be notified.";
      case "Rejected":
        return "This application has been declined and the candidate will be notified.";
      case "Pending":
        return "This application is under review and awaiting a decision.";
      default:
        return "Application status is being processed.";
    }
  };

  return (
    <div className="relative overflow-hidden bg-black border border-white/20 rounded-xl shadow-xl">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}></div>
      </div>

      {/* Header with Icon */}
      <div className="relative p-6 border-b border-white/10 bg-gradient-to-r from-white/5 to-white/10">
        <div className="flex items-center gap-3 mb-2">
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-md"></div>
            <div className="relative p-2 bg-white/10 rounded-full border border-white/20">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              Application Management
            </h3>
            <p className="text-xs text-white/60">
              Review and update application status
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative p-6">
        {/* Current Status Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-white/10 rounded-full border border-white/20">
              {getStatusIcon(currentStatus)}
            </div>
            <span className="text-sm font-medium text-white/80">Current Status</span>
          </div>
          
          <div className="bg-white/5 rounded-lg p-4 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                  currentStatus === "Pending"
                    ? "bg-white/10 text-white border-white/20"
                    : currentStatus === "Accepted"
                      ? "bg-white text-black border-white"
                      : "bg-white/20 text-white border-white/30"
                }`}
              >
                {getStatusIcon(currentStatus)}
                {currentStatus.toUpperCase()}
              </span>
              <div className="text-xs text-white/50">
                ID: {applicationId.slice(-8)}
              </div>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              {getStatusDescription(currentStatus)}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-white/60" />
            <span className="text-sm font-medium text-white/80">Available Actions</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {currentStatus !== "Accepted" && (
              <Button
                onClick={() => {
                  setNextStatus("Accepted");
                  setOpen(true);
                }}
                disabled={loading !== null}
                className="group bg-white text-black hover:bg-white/90 border border-white/20 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <Check className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Accept</span>
              </Button>
            )}

            {currentStatus !== "Rejected" && (
              <Button
                onClick={() => {
                  setNextStatus("Rejected");
                  setOpen(true);
                }}
                disabled={loading !== null}
                className="group bg-white/10 text-white hover:bg-white/20 border border-white/30 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl backdrop-blur-sm"
              >
                <X className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Reject</span>
              </Button>
            )}

            {currentStatus !== "Pending" && (
              <Button
                onClick={() => {
                  setNextStatus("Pending");
                  setOpen(true);
                }}
                disabled={loading !== null}
                className="group bg-white/10 text-white hover:bg-white/20 border border-white/20 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl backdrop-blur-sm"
              >
                <Clock className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Mark Pending</span>
              </Button>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-xs text-white/40 border-t border-white/10 pt-4">
          <div className="flex items-center justify-between">
            <span>Job ID: {jobId.slice(-8)}</span>
            <span>Last updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Single Shared Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-black text-white border border-white/20 rounded-xl shadow-2xl">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/10 rounded-full border border-white/20">
                {nextStatus && getStatusIcon(nextStatus)}
              </div>
              <DialogTitle className="text-xl">Confirm {nextStatus}</DialogTitle>
            </div>
            <DialogDescription className="text-white/70 leading-relaxed">
              Are you sure you want to mark this application as{" "}
              <span className="font-semibold text-white">{nextStatus}</span>? 
              This action will update the status immediately and notify the candidate.
            </DialogDescription>
          </DialogHeader>

          <div className="my-4 p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="text-sm text-white/80">
              <span className="font-medium">Application ID:</span> {applicationId}
            </div>
            <div className="text-sm text-white/80 mt-1">
              <span className="font-medium">Current Status:</span> {currentStatus}
            </div>
            <div className="text-sm text-white/80 mt-1">
              <span className="font-medium">New Status:</span> {nextStatus}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={loading !== null}
              className={`${
                nextStatus === "Accepted"
                  ? "bg-white text-black hover:bg-white/90"
                  : "bg-white/20 text-white hover:bg-white/30 border border-white/30"
              } transition-all duration-300`}
            >
              {loading === nextStatus && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              <span className="font-medium">Confirm {nextStatus}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Actions;