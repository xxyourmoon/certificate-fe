"use client";

import { IEventParticipantCertificate } from "@/lib/types/Event";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import { TemplateHeader } from "./components/TemplateHeader";
import { TemplateCertificateNumber } from "./components/TemplateCertificateNumber";
import { TemplateContent } from "./components/TemplateContent";
import { TemplateStakeholderImage } from "./components/TemplateStakeholderImage";
import { TemplateStakeholderName } from "./components/TemplateStakeholderName";

type Props = {
  participantCertificateData?: IEventParticipantCertificate;
  mode: "CREATE/EDIT" | "PREVIEW" | "VIEW";
};

export const SemnastiDesignTemplate = ({
  participantCertificateData,
  mode,
}: Props) => {
  const [stakeholderData] = useState<
    | {
        name: string;
        photoPath: string | null;
        position: string;
      }
    | undefined
  >(
    participantCertificateData
      ? {
          name: participantCertificateData.stakeholders.name,
          photoPath: participantCertificateData.stakeholders.photoPath,
          position: participantCertificateData.stakeholders.position,
        }
      : undefined,
  );

  if (!participantCertificateData || !stakeholderData) {
    return (
      <div className="flex items-center justify-center w-full h-full p-4 text-gray-500 font-bold rounded-lg bg-transparent">
        <span>Certificate data not available</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        mode === "CREATE/EDIT"
          ? "w-[280px] h-[400px] md:w-[300px] md:h-[450px]"
          : mode === "PREVIEW"
          ? "w-[300px] h-[450px] md:w-[500px] md:h-[750px]"
          : "w-[350px] h-[500px] md:w-[490px] md:h-[700px]",
      )}
    >
      <div className="relative mx-auto overflow-hidden flex flex-col items-center justify-center w-full h-full">
        {/* BACKGROUND IMAGE */}
        <Image
          src={`/template/${
            participantCertificateData.eventTemplate || "default"
          }.png`}
          alt="Event Template"
          width={465}
          height={465}
          className={cn(
            "object-center",
            "object-cover",
            "mx-auto",
            "w-full h-full",
          )}
          priority
        />
        <div
          className={cn(
            "absolute inset-0 flex flex-col justify-center",
            mode === "CREATE/EDIT"
              ? "py-2 pb-38 md:py-2 md:pb-35 px-7 md:px-8"
              : mode === "PREVIEW"
              ? "py-2 pb-37 md:py-3 md:pb-65 px-6 md:px-10"
              : "py-2 pb-43 md:py-3 md:pb-60 px-6 md:px-13",
          )}
        >
          {/* HEADER */}
          <TemplateHeader
            className={cn(
              mode === "CREATE/EDIT"
                ? participantCertificateData.logoFirst ||
                  participantCertificateData.logoSecond
                  ? stakeholderData.photoPath
                    ? "mb-2 md:mb-[14.5px]"
                    : "mb-4 md:mb-5"
                  : stakeholderData.photoPath
                  ? "mb-7 md:mb-[6px]"
                  : "mb-[10px]"
                : mode === "PREVIEW"
                ? participantCertificateData.logoFirst ||
                  participantCertificateData.logoSecond
                  ? stakeholderData.photoPath
                    ? "mb-[10px] md:mb-[34px]"
                    : "mb-7 md:mb-12"
                  : stakeholderData.photoPath
                  ? "mb-[10px] md:mb-[31px]"
                  : "mb-0 md:mb-[25px]"
                : participantCertificateData.logoFirst ||
                  participantCertificateData.logoSecond
                ? stakeholderData.photoPath
                  ? "mb-[17px] md:mb-5"
                  : "mb-7 md:mb-4"
                : stakeholderData.photoPath
                ? "mb-[17px] md:mb-[16px]"
                : "mb-4 md:mb-4",
              mode === "CREATE/EDIT"
                ? "gap-1 md:gap-1"
                : mode === "PREVIEW"
                ? "gap-1 md:gap-1"
                : "gap-1 md:gap-1",
            )}
          >
            <TemplateCertificateNumber
              participantCertificateData={participantCertificateData}
              mode={mode}
              className={cn(
                mode === "CREATE/EDIT"
                  ? "text-[7px] md:text-[7.4px]"
                  : mode === "PREVIEW"
                  ? "text-[7.7px] md:text-[13px]"
                  : "text-[9px] md:text-[13px]",
                "font-[400] font-roboto-condensed",
                "text-white tracking-widest",
              )}
              onlyCertificateNumber={false}
            />
          </TemplateHeader>
          {/* END HEADER */}

          {/* CONTENT */}
          <TemplateContent
            className={
              mode === "CREATE/EDIT"
                ? "space-y-3"
                : mode === "PREVIEW"
                ? "space-y-2 md:space-y-5"
                : "space-y-2 md:space-y-6"
            }
          >
            {/* STAKEHOLDER IMAGE */}
            <TemplateStakeholderImage
              stakeholderData={stakeholderData}
              classNameNoPhotoPath={
                mode === "CREATE/EDIT"
                  ? "w-18 h-18 md:w-27 md:h-27 mb-14 md:mb-5"
                  : mode === "PREVIEW"
                  ? "w-27 h-27 md:w-45 md:h-45"
                  : "w-22 h-22 md:w-45 md:h-45"
              }
              classNamePhotoPath={
                mode === "CREATE/EDIT"
                  ? "w-24 h-24 md:w-27 md:h-27"
                  : mode === "PREVIEW"
                  ? "w-27 h-27 md:w-45 md:h-45"
                  : "w-30 h-30 md:w-45 md:h-45"
              }
            />
            {/* END STAKEHOLDER IMAGE */}
            {/* STAKEHOLDER DATA */}
            <div
              className={cn(
                "flex flex-col items-center space-y-2",
                stakeholderData.photoPath === null
                  ? mode === "CREATE/EDIT"
                    ? stakeholderData.photoPath
                      ? "mt-8 md:mt-9"
                      : "mt-2 md:mt-0"
                    : mode === "PREVIEW"
                    ? "mt-5 md:mt-9"
                    : "mt-5 md:mt-2"
                  : mode === "CREATE/EDIT"
                  ? "mt-4 md:mt-4"
                  : mode === "PREVIEW"
                  ? "mt-5 md:mt-7"
                  : "mt-6 md:mt-4",
              )}
            >
              {/* STAKEHOLDER NAME */}
              <TemplateStakeholderName
                stakeholderData={stakeholderData}
                className={cn(
                  mode === "CREATE/EDIT"
                    ? "text-[11px] md:text-[12px]"
                    : mode === "PREVIEW"
                    ? "text-xs md:text-xl"
                    : "text-[13px] md:text-xl",
                  "text-white font-roboto-condensed font-bold",
                )}
              />
              {/* END STAKEHOLDER NAME */}
            </div>
            {/* END STAKEHOLDER DATA */}
          </TemplateContent>
          {/* END CONTENT */}
        </div>
      </div>
    </div>
  );
};
