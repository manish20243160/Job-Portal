import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, X, DollarSign, FileText, Briefcase } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { CATEGORIES, JOB_TYPES } from "../../utils/data";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

// Components
import Sidebar from "../../components/layout/Sidebar";
import Button from "../../components/Common/Button";
import Input from "../../components/Common/Input";
import Loader from "../../components/Common/Loader";
import JobPreviewCard from "../../components/Employer/JobPreviewCard";
import { Eye, Edit3 } from "lucide-react";

const JobPostingForm = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    category: "",
    type: "",
    salaryMin: "",
    salaryMax: "",
  });

  useEffect(() => {
    if (jobId) {
      const fetchJob = async () => {
        setFetching(true);
        try {
          const res = await axiosInstance.get(API_PATHS.JOBS.GET_BY_ID(jobId));
          setFormData({
            title: res.data.title,
            description: res.data.description,
            requirements: res.data.requirements,
            location: res.data.location || "",
            category: res.data.category || "",
            type: res.data.type,
            salaryMin: res.data.salaryMin || "",
            salaryMax: res.data.salaryMax || "",
          });
        } catch {
          toast.error("Failed to load job details");
          navigate("/manage-jobs");
        } finally {
          setFetching(false);
        }
      };
      fetchJob();
    }
  }, [jobId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.type) {
      toast.error("Please fill in required fields");
      return;
    }

    setLoading(true);
    try {
      if (jobId) {
        await axiosInstance.put(API_PATHS.JOBS.UPDATE(jobId), formData);
        toast.success("Job updated successfully!");
      } else {
        await axiosInstance.post(API_PATHS.JOBS.CREATE, formData);
        toast.success("Job posted successfully!");
      }
      navigate("/manage-jobs");
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Loader fullPage />;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar logout={logout} />

      <main className="flex-1 overflow-hidden h-screen flex flex-col">
        {/* Header */}
        <div className="p-4 md:p-8 flex items-center justify-between bg-white border-b border-gray-100 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <Button variant="secondary" size="sm" onClick={() => navigate(-1)} className="!rounded-full p-2">
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">
              {jobId ? "Edit Job Posting" : "Launch a New Vacancy"}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowPreview(!showPreview)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 font-bold text-xs uppercase transition-all"
            >
              {showPreview ? <Edit3 size={16} /> : <Eye size={16} />}
              {showPreview ? "Edit Mode" : "Preview Mode"}
            </button>
            <Button onClick={handleSubmit} loading={loading} size="sm" icon={Save}>
               {jobId ? "Save Changes" : "Publish Job"}
            </Button>
          </div>
        </div>

        {/* Content Container */}
        <div className="flex-1 flex overflow-hidden">
          {/* Edit Form */}
          <div className={`flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar ${showPreview ? 'hidden lg:block' : 'block'}`}>
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8 pb-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <Input
                    label="Job Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Lead Brand Designer"
                    icon={Briefcase}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Category</label>
                  <select
                    name="category" value={formData.category} onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition-all bg-gray-50"
                    required
                  >
                    <option value="">Select Category</option>
                    {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Job Type</label>
                  <select
                    name="type" value={formData.type} onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 transition-all bg-gray-50"
                    required
                  >
                    <option value="">Select Type</option>
                    {JOB_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>

                <Input
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. London, UK (or Remote)"
                  icon={FileText}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Min Salary ($)"
                    type="number"
                    name="salaryMin"
                    value={formData.salaryMin}
                    onChange={handleChange}
                    icon={DollarSign}
                  />
                  <Input
                    label="Max Salary ($)"
                    type="number"
                    name="salaryMax"
                    value={formData.salaryMax}
                    onChange={handleChange}
                    icon={DollarSign}
                  />
                </div>

                <div className="md:col-span-2">
                  <Input
                    label="Job Description"
                    type="textarea"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the mission, role, and requirements in detail..."
                    required
                    rows={6}
                  />
                </div>

                <div className="md:col-span-2">
                  <Input
                    label="Specific Requirements"
                    type="textarea"
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    placeholder="Skills, tech stack, experience needed..."
                    required
                    rows={4}
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Live Preview Pane */}
          <div className={`flex-1 overflow-y-auto p-4 md:p-8 bg-gray-100/50 custom-scrollbar ${showPreview ? 'block' : 'hidden lg:block border-l border-gray-100'}`}>
            <div className="max-w-3xl mx-auto h-full space-y-4">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] text-center lg:text-left">LIVE PREVIEW - CANDIDATE VIEW</p>
               <JobPreviewCard data={formData} user={user} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobPostingForm;
