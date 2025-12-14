import { FormalDesign1Template } from "@/components/template/FormalDesign1Template";
import { FormalDesign2Template } from "@/components/template/FormalDesign2Template";
import { FormalDesign3Template } from "@/components/template/FormalDesign3Template";
import { SemnastiDesignTemplate } from "@/components/template/SemnastiDesignTemplate";
import { TechnologyDesign1Template } from "@/components/template/TechnologyDesign1Template";
import { TechnologyDesign2Template } from "@/components/template/TechnologyDesign2Template";
import { TechnologyDesign3Template } from "@/components/template/TechnologyDesign3Template";
import { IEventParticipantCertificate } from "@/lib/types/Event";
import { BadgeCheck, TriangleAlert } from "lucide-react";

const getParticipantCertificateData = async (
  eventUid: string,
  participantUid: string,
) => {
  try {
    if (!eventUid || !participantUid) {
      return null;
    }
    const res = await fetch(
      `${process.env.FRONTEND_URL}/api/events/${eventUid}/participants/${participantUid}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    if (!data.success) {
      return null;
    }
    return data.data as IEventParticipantCertificate;
  } catch (error) {
    console.error("Error fetching participant data:", error);
    return null;
  }
};

const CertificateStakeholderPage = async ({
  params,
}: {
  params: Promise<{ uid: string[] }>;
}) => {
  const [eventUid, participantUid] = (await params).uid;
  if (!eventUid || !participantUid) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="inline-flex items-center font-bold text-2xl ">
          <TriangleAlert className="mr-1" /> Invalid Event / Participant UID
        </h1>
        <p className="mt-4 text-lg text-grayy font-medium">
          The event or participant you are looking for does not exist.
        </p>
      </div>
    );
  }
  const participantCertificateData = await getParticipantCertificateData(
    eventUid,
    participantUid,
  );

  if (!participantCertificateData || participantCertificateData === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="inline-flex items-center font-bold text-2xl ">
          <BadgeCheck className="mr-1" /> Certificate Not Found
        </h1>
        <p className="mt-4 text-lg text-grayy font-medium">
          The certificate you are looking for does not exist.
        </p>
      </div>
    );
  }
  return (
    <>
      {participantCertificateData.eventTemplate === "DEFAULTDESIGN" ? (
        "DEFAULT DESIGN"
      ) : participantCertificateData.eventTemplate === "SEMNASTIDESIGN" ? (
        <div className="flex flex-col items-center justify-start md:justify-start min-h-screen">
          <SemnastiDesignTemplate
            participantCertificateData={participantCertificateData}
            mode="VIEW"
          />
        </div>
      ) : participantCertificateData.eventTemplate === "FORMALDESIGN_1" ? (
        <div className="flex flex-col items-center justify-start md:justify-start min-h-screen">
          <FormalDesign1Template
            participantCertificateData={participantCertificateData}
            mode="VIEW"
          />
        </div>
      ) : participantCertificateData.eventTemplate === "FORMALDESIGN_2" ? (
        <div className="flex flex-col items-center justify-start md:justify-start min-h-screen">
          <FormalDesign2Template
            participantCertificateData={participantCertificateData}
            mode="VIEW"
          />
        </div>
      ) : participantCertificateData.eventTemplate === "FORMALDESIGN_3" ? (
        <div className="flex flex-col items-center justify-start md:justify-start min-h-screen">
          <FormalDesign3Template
            participantCertificateData={participantCertificateData}
            mode="VIEW"
          />
        </div>
      ) : participantCertificateData.eventTemplate === "TECHNOLOGYDESIGN_1" ? (
        <div className="flex flex-col items-center justify-start md:justify-start min-h-screen">
          <TechnologyDesign1Template
            participantCertificateData={participantCertificateData}
            mode="VIEW"
          />
        </div>
      ) : participantCertificateData.eventTemplate === "TECHNOLOGYDESIGN_2" ? (
        <div className="flex flex-col items-center justify-start md:justify-start min-h-screen">
          <TechnologyDesign2Template
            participantCertificateData={participantCertificateData}
            mode="VIEW"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-start md:justify-start min-h-screen">
          <TechnologyDesign3Template
            participantCertificateData={participantCertificateData}
            mode="VIEW"
          />
        </div>
      )}
    </>
  );
};

export default CertificateStakeholderPage;
