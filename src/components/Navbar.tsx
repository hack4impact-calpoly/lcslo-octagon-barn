"use client";

import Link from "next/link";
import Image from "next/image";
import { UserButton, SignedIn, useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Types } from "mongoose";

// copy of alert Schema
interface IAlert {
  _id?: string;
  eventId: Types.ObjectId;
  alertDateTime: Date;
  updateType: "Event" | "DocUpload" | "DocReupload" | "DocApproval" | "DocRejected";
  descriptor: string;
  alertFrom: string;
  alertTo: string;
  isRead: boolean;
}

export default function Navbar() {
  const { user, isLoaded } = useUser();
  const [authorized, setAuthorized] = useState(false);
  const [alerts, setAlerts] = useState<IAlert[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      setAuthorized(true);
      if (user.publicMetadata.isAdmin) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } else if (isLoaded && !user) {
      setAuthorized(false);
      setIsAdmin(false);
    }
  }, [user, isLoaded]);

  useEffect(() => {
    if (!user?.id) return;

    const alertTo = isAdmin ? "admin" : user.id;

    fetch(`/api/notification?alertTo=${alertTo}`)
      .then((res) => res.json())
      .then((data: IAlert[]) => setAlerts(data))
      .catch((err) => console.error("Failed to load alerts", err));
  }, [user?.id, isAdmin]);

  useEffect(() => {
    setUnreadCount(alerts.filter((alert) => !alert.isRead).length);
  }, [alerts]);

  const flipReadStatus = (alertId: string) => {
    const alert = alerts.find((a) => a._id === alertId);
    if (!alert) return;
    const newIsRead = !alert.isRead;

    setAlerts((prevAlerts) =>
      prevAlerts.map((alert) => (alert._id === alertId ? { ...alert, isRead: newIsRead } : alert)),
    );

    fetch(`/api/notification/${alertId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isRead: newIsRead }),
    });
  };

  const dismissAlert = (alertId: string) => {
    const alert = alerts.find((a) => a._id === alertId);
    if (!alert) return;

    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert._id !== alertId));

    fetch(`/api/notification/${alertId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete alert");
        }
      })
      .catch((err) => console.error("Failed to dismiss alert", err));
  };

  const handleAlertClick = (event: React.MouseEvent, alertId: string) => {
    // Only mark as read if the click is not on the dismiss button
    const target = event.target as HTMLElement;
    const isCloseButton = target.closest('button[data-dismiss="true"]');

    if (!isCloseButton) {
      flipReadStatus(alertId);
    }
  };

  return (
    <div className="w-full h-25">
      <nav className="flex justify-between items-center w-full">
        {/* logo */}
        <div className="pl-16 pr-8 pt-5 pd-5">
          <Link href="/">
            <Image src="/logo.png" alt="Octagon Barn Logo" width={182} height={64} />
          </Link>
        </div>

        {/* notification & profile */}
        <SignedIn>
          <div className="flex items-center space-x-20 pl-10 pr-16 pt-5 pd-5">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="min-w-[10rem] w-[calc(100vw-15rem)] max-w-[25rem] p-0"
                align="end"
                sideOffset={8}
              >
                <div className="p-4 bg-neutral-100 border-b flex justify-between items-center">
                  <h3 className="font-medium text-base">Notifications</h3>
                  <span className="text-sm text-neutral-500">{alerts.length} total</span>
                </div>
                <div className="max-h-[18rem] overflow-y-auto">
                  {alerts.length === 0 ? (
                    <div className="p-6 text-center text-neutral-500">No notifications</div>
                  ) : (
                    alerts.map((alert) => (
                      <div
                        key={alert._id}
                        className={`p-4 border-b flex justify-between ${alert.isRead ? "bg-white" : "bg-blue-50"}`}
                        onClick={(e) => handleAlertClick(e, alert._id!)}
                      >
                        <div className="flex-1 mr-3">
                          <p className="text-sm font-medium">{alert.updateType}</p>
                          <p className="text-sm">{alert.descriptor}</p>
                          <p className="text-xs text-neutral-500">
                            <Link
                              href={`/view/event/${alert.eventId}`}
                              className="text-blue-500 hover:underline font-semibold"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              View Event
                            </Link>
                          </p>
                          <p className="text-xs text-neutral-500 mt-2">
                            {new Date(alert.alertDateTime).toLocaleString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 self-start shrink-0"
                          data-dismiss="true"
                          onClick={() => dismissAlert(alert._id!)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>
            <UserButton />
          </div>
        </SignedIn>
      </nav>
    </div>
  );
}
