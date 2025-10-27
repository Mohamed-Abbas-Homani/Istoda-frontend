"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Upload, Save, Plus } from "lucide-react";
import { useStoryStore, usePageStore, useCategoryStore, useNotificationStore } from "@/services/stores";
import { Button, Input, Textarea, Dialog } from "@/components/ui";
import { cn } from "@/lib/utils";

interface PageData {
  tempId: string;
  pageNumber: number;
  content: string;
}

const CreateStory: React.FC = () => {
  const router = useRouter();
  const { createStory, isLoading: storyLoading } = useStoryStore();
  const { createPage } = usePageStore();
  const { categories, getCategories, isLoading: categoriesLoading } = useCategoryStore();
  const { addNotification } = useNotificationStore();

  // Story fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  // Pages
  const [pages, setPages] = useState<PageData[]>([
    { tempId: "page-1", pageNumber: 1, content: "" }
  ]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  // Dialog state
  const [showDialog, setShowDialog] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    categories: "",
    coverPhoto: "",
  });

  // Load categories
  useEffect(() => {
    getCategories();
  }, [getCategories]);

  // Track changes
  useEffect(() => {
    if (title || description || categoryIds.length > 0 || coverPhoto || pages.some(p => p.content)) {
      setHasChanges(true);
    }
  }, [title, description, categoryIds, coverPhoto, pages]);

  const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverPhoto(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setCategoryIds(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const addPage = () => {
    const newPage: PageData = {
      tempId: `page-${Date.now()}`,
      pageNumber: pages.length + 1,
      content: "",
    };
    setPages([...pages, newPage]);
    setCurrentPageIndex(pages.length);
  };

  const updatePageContent = (tempId: string, content: string) => {
    setPages(pages.map(page =>
      page.tempId === tempId ? { ...page, content } : page
    ));
  };

  const goToNextPage = () => {
    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    } else {
      addPage();
    }
  };

  const goToPrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  const handleBack = () => {
    if (hasChanges) {
      setShowDialog(true);
    } else {
      router.push("/home");
    }
  };

  const handleDiscard = () => {
    router.push("/home");
  };

  const validateForm = () => {
    const newErrors = {
      title: "",
      description: "",
      categories: "",
      coverPhoto: "",
    };

    let isValid = true;

    // Validate title
    if (!title.trim()) {
      newErrors.title = "Story title is required";
      isValid = false;
    } else if (title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
      isValid = false;
    } else if (title.trim().length > 100) {
      newErrors.title = "Title must be less than 100 characters";
      isValid = false;
    }

    // Validate description (optional but with max length)
    if (description.trim().length > 500) {
      newErrors.description = "Description must be less than 500 characters";
      isValid = false;
    }

    // Validate categories
    if (categoryIds.length === 0) {
      newErrors.categories = "Please select at least one category";
      isValid = false;
    }

    // Validate cover photo
    if (!coverPhoto) {
      newErrors.coverPhoto = "Cover photo is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    // Validate form
    if (!validateForm()) {
      addNotification("Please fix the errors before publishing", "error");
      return;
    }

    // Filter out pages with no content (except the first page which is for cover)
    const contentPages = pages.slice(1).filter(p => p.content.trim());

    if (contentPages.length === 0) {
      addNotification("Please add at least one page with content", "error");
      return;
    }

    try {
      const storyData = {
        title: title.trim(),
        description: description.trim(),
        categoryIds,
        coverPhoto: coverPhoto as File,
      };

      const createdStory = await createStory(storyData);
      addNotification("Story created successfully!", "success");

      for (const page of contentPages) {
        await createPage(createdStory.id, {
          pageNumber: page.pageNumber,
          content: page.content,
        });
      }
      addNotification("Pages added successfully!", "success");

      router.push(`/story/${createdStory.id}`);
    } catch (error: any) {
      addNotification(error.message || "Failed to create story", "error");
    }
  };

  const currentPage = pages[currentPageIndex];
  const isFirstPage = currentPageIndex === 0;

  return (
    <div className="h-screen w-full flex bg-background overflow-hidden">
      {/* Left Side - Story Information */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold text-primary mb-6">Story Information</h2>

          {/* Title */}
          <Input
            label="Story Title *"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors({ ...errors, title: "" });
            }}
            placeholder="Enter your story title"
            required
            error={errors.title}
          />

          {/* Description */}
          <Textarea
            label="Description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) setErrors({ ...errors, description: "" });
            }}
            placeholder="Brief description of your story (optional)"
            rows={4}
            error={errors.description}
          />

          {/* Categories */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
              Categories * (Select at least one)
            </label>
            {errors.categories && (
              <p className="text-sm text-error">{errors.categories}</p>
            )}
            {categoriesLoading ? (
              <p className="text-sm text-muted-foreground">Loading categories...</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className={cn(
                      "inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 cursor-pointer transition-all",
                      categoryIds.includes(category.id)
                        ? "bg-primary/10 border-primary text-primary font-medium"
                        : "bg-background border-border hover:border-primary/50"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={categoryIds.includes(category.id)}
                      onChange={() => handleCategoryToggle(category.id)}
                      className="hidden"
                    />
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span>{category.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-8 p-4 rounded-lg bg-muted/50 border border-border">
            <h3 className="font-medium text-foreground mb-2">Instructions:</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>First page is for your cover photo</li>
              <li>Use arrow buttons to navigate between pages</li>
              <li>Click "+ New Page" to add more pages</li>
              <li>Fill in all story information before publishing</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleBack}
              variant="outline"
              size="lg"
              className="flex-1"
            >
              <ArrowLeft className="h-5 w-5" />
              Back
            </Button>
            <Button
              onClick={handleSave}
              variant="primary"
              size="lg"
              className="flex-1"
              disabled={storyLoading}
              loading={storyLoading}
            >
              <Save className="h-5 w-5" />
              Publish
            </Button>
          </div>
        </div>
      </div>

      {/* Right Side - Page Editor (2:3 aspect ratio, full viewport height) */}
      <div className="flex flex-col items-center justify-center flex-shrink-0 bg-muted/30 p-8 gap-4">
        <div
          className="bg-white shadow-2xl relative"
          style={{
            height: 'calc(100vh - 80px)',
            width: 'calc((100vh - 80px) * 2 / 3)',
          }}
        >
          {isFirstPage ? (
            // First Page - Cover Photo Upload
            <div className="w-full h-full flex items-center justify-center">
              <input
                type="file"
                id="coverPhoto"
                accept="image/*"
                onChange={handleCoverPhotoChange}
                className="hidden"
              />
              <label
                htmlFor="coverPhoto"
                className="w-full h-full cursor-pointer group relative"
              >
                {coverPreview ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={coverPreview}
                      alt="Cover preview"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 text-white">
                      <Upload className="h-12 w-12" />
                      <span className="text-lg font-medium">Change Cover Photo</span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-muted-foreground border-2 border-dashed border-muted-foreground/30 group-hover:border-primary/50 transition-colors">
                    <Upload className="h-16 w-16" />
                    <div className="text-center">
                      <p className="text-xl font-medium mb-2">Upload Cover Photo</p>
                      <p className="text-sm">Click to select an image</p>
                    </div>
                  </div>
                )}
              </label>
            </div>
          ) : (
            // Content Pages
            <textarea
              value={currentPage?.content || ""}
              onChange={(e) => updatePageContent(currentPage.tempId, e.target.value)}
              placeholder={`Write content for page ${currentPageIndex}...`}
              className="w-full h-full p-8 resize-none focus:outline-none text-black bg-white"
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: '16px',
                lineHeight: '1.8',
              }}
            />
          )}

          {/* Page Number Indicator */}
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            {isFirstPage ? 'Cover' : `Page ${currentPageIndex}`}
          </div>
        </div>

        {/* Page Navigation Buttons - Below the page editor */}
        <div className="flex gap-3 justify-end w-full max-w-[calc((100vh-80px)*2/3)]">
          {currentPageIndex > 0 && (
            <Button
              variant="secondary"
              size="icon"
              onClick={goToPrevPage}
              title="Previous page"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <Button
            variant="primary"
            size="icon"
            onClick={addPage}
            title="Add new page"
          >
            <Plus className="h-5 w-5" />
          </Button>
          {currentPageIndex < pages.length - 1 && (
            <Button
              variant="secondary"
              size="icon"
              onClick={goToNextPage}
              title="Next page"
            >
              <ArrowRight className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Discard/Save Dialog */}
      <Dialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        title="Unsaved Changes"
        description="You have unsaved changes. Do you want to save your story or discard it?"
      >
        <div className="flex gap-3">
          <Button
            onClick={handleDiscard}
            variant="outline"
            className="flex-1"
          >
            Discard
          </Button>
          <Button
            onClick={() => {
              setShowDialog(false);
              handleSave();
            }}
            variant="primary"
            className="flex-1"
            disabled={storyLoading}
            loading={storyLoading}
          >
            Save & Publish
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default CreateStory;
