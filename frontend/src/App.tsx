/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, type ChangeEvent, type FormEvent } from "react";
import "./App.css";
import { createReportHandler } from "./axios/axios";
import process from "node:process";

export interface FormType {
  name: string;
  contact: string;
  location: string;
  description: string;
}

type FormErrors = Partial<FormType>;

function App() {
  const [formData, setFormData] = useState<FormType>({
    name: "",
    contact: "",
    location: "",
    description: "",
  });

  const [reports, setReports] = useState<any>([]);

  const [errors, setErrors] = useState<FormErrors>({});

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormType]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const tempErrs: FormErrors = {};

    const phoneRegex = /^(?:\+88|88)?(01[3-9]\d{8})$/;

    if (!formData.name.trim()) {
      tempErrs.name = "Please provide your name";
    }
    if (!formData.contact.trim()) {
      tempErrs.contact = "Number is required";
    } else if (!phoneRegex.test(formData.contact.replace(/[-\s]/g, ""))) {
      tempErrs.contact = "Valid BD phone number required (e.g. 017xxxxxxxx)";
    }
    if (!formData.location.trim()) {
      tempErrs.location = "Please provide your location";
    }

    const descriptionText = formData.description.trim();

    if (!descriptionText) {
      tempErrs.description = "Please provide what happend in your area ";
    } else {
      const wordCount = descriptionText
        .split(/\s+/)
        .filter((word) => word.length > 0).length;

      if (wordCount < 10) {
        tempErrs.description = `Description must be at least 10 words (Currently: ${wordCount})`;
      } else if (wordCount > 20) {
        tempErrs.description = `Description cannot exceed 20 words (Currently: ${wordCount})`;
      }
    }

    setErrors(tempErrs);

    return Object.keys(tempErrs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitted(true);
      if (validateForm()) {
        const response = await createReportHandler(formData);

        const newlyCreatedReport = response.data.data;

        setReports((prev: any) => [newlyCreatedReport, ...prev]);

        setFormData({
          name: "",
          contact: "",
          location: "",
          description: "",
        });
      } else {
        return;
      }
    } catch (error: any) {
      console.error("Error submitting report:", error);

      if (error.response && error.response.data) {
        alert(error.response.data.message || "Failed to create report.");
      } else {
        alert(error.message || "Please try again later.");
      }
    } finally {
      setIsSubmitted(false);
    }
  };

  return (
    <div className=" min-h-screen bg-[#0a0b10] py-12 px-4 flex flex-col items-center max-w-360 w-full mx-auto">
      <h1 className="text-xl md:text-3xl font-bold text-center text-white mb-10 max-w-3xl leading-relaxed">
        CrisisDesk AI: Intelligent API for Emergency & Service Request Triage
      </h1>

      <div className="w-full flex flex-col items-center lg:flex-row justify-around lg:items-baseline px-5 py-3 gap-10">
        <div className="w-full max-w-lg bg-[#1d1d1f] p-5 md:p-8 rounded-2xl shadow-2xl border border-gray-200/10">
          <h2 className="text-white text-center text-xl md:text-2xl font-semibold mb-6">
            Inform Us Your Problem
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* name , contact . location input  */}
            {[
              { name: "name", type: "text", placeholder: "Your name" },
              { name: "contact", type: "text", placeholder: "Mobile Number" },
              { name: "location", type: "text", placeholder: "Your location" },
            ].map((field) => (
              <div className="flex flex-col" key={field.name}>
                <label className="text-gray-300 text-sm mb-1 ml-1 capitalize">
                  {field.name}
                </label>
                <input
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={formData[field.name as keyof FormType]}
                  onChange={handleChange}
                  className="bg-[#2a2a2d] border border-gray-200/10 text-white placeholder-gray-300 p-3 rounded-xl focus:outline-none focus:border-[#eb5544] focus:ring-1 focus:ring-[#eb5544] transition-all"
                />
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    errors[field.name as keyof FormType]
                      ? "max-h-10 opacity-100 mt-1.5"
                      : "max-h-0 opacity-0 mt-0"
                  }`}
                >
                  <span className="text-red-400 text-xs ml-1 font-medium block">
                    {errors[field.name as keyof FormType]}
                  </span>
                </div>
              </div>
            ))}

            {/* Description Textarea */}
            <div className="flex flex-col">
              <label className="text-gray-300 text-sm mb-1 ml-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="What happened ??"
                className="bg-[#2a2a2d] border border-gray-200/10 text-white placeholder-gray-300 p-3 rounded-xl h-32 resize-none focus:outline-none focus:border-[#eb5544] focus:ring-1 focus:ring-[#eb5544] transition-all"
              />
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  errors.description
                    ? "max-h-10 opacity-100 mt-1.5"
                    : "max-h-0 opacity-0 mt-0"
                }`}
              >
                <span className="text-red-400 text-xs ml-1 font-medium block">
                  {errors.description}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitted}
              className="w-full bg-[#eb5544] text-white cursor-pointer font-bold text-lg p-3.5 rounded-xl transition-colors mt-4 "
            >
              Submit
            </button>
          </form>
        </div>
        <div className="w-full bg-[#1d1d1f] p-8 rounded-2xl shadow-2xl border border-gray-200/10 flex text-white justify-center overflow-auto flex-col">
          <h2 className="text-white text-center text-2xl font-semibold mb-6 border-b pb-5 border-gray-300/20">
            Reports
          </h2>
          <div className="reports-container space-y-4 p-4">
            {reports.length === 0 ? (
              <p className="text-white text-2xl font-semibold text-center">
                No reports yet.
              </p>
            ) : (
              reports.map((report: any) => (
                <div
                  key={report._id}
                  className="bg-[#2a2a2d] p-5 rounded-xl border border-gray-700 text-white"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg capitalize">
                        {report.name}
                      </h3>
                      <p className="text-sm text-gray-400">{report.location}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        report.urgency === "critical"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {report.urgency}
                    </span>
                  </div>

                  <p className="text-gray-300 text-sm mb-4">
                    "{report.description}"
                  </p>

                  <div className="bg-black/30 p-3 rounded-lg border border-gray-600/50">
                    <p className="text-xs text-amber-400 font-semibold mb-1">
                      AI Analysis:
                    </p>
                    <p className="text-sm">
                      <strong>Category:</strong>{" "}
                      <span className="capitalize">{report.category}</span>
                    </p>
                    <p className="text-sm mt-1">
                      <strong>Action:</strong> {report.suggestedAction}
                    </p>
                    <p className="text-sm mt-1 text-green-400">
                      <strong>Confidence:</strong>{" "}
                      {(report.confidence * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {isSubmitted && (
        <div className="text-white absolute w-full min-h-screen inset-0 bg-white/5 backdrop-blur-sm z-50 flex items-start justify-center">
          <div className="flex flex-col items-center justify-center max-w-2xl w-full mx-auto h-64 mt-30 bg-[#1d1d1f] rounded-xl border border-gray-300/10 shadow-md p-8 text-center">
            <h1 className="text-xl md:text-3xl font-bold text-white mb-6 leading-relaxed">
              Creating report please wait a moment...
            </h1>

         
            <div className="w-14 h-14 border-4 border-gray-700 border-t-[#eb5544] rounded-full animate-spin"></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
