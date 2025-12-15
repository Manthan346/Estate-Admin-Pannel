


import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Textarea } from '../components/ui/textarea'
import { useBullets } from "../Hooks/useBullets";
import { useMultiImage } from "../Hooks/useMultiImage";
import { Button } from "../components/ui/button";
import { cityList, fetchProject, addNewProject } from "../api";
import { Spinner } from "../components/ui/spinner"
import { ToastContainer, toast, Bounce } from 'react-toastify';

function AdminPannel() {
  const [city, setCity] = useState([])
  const [selectCity, setSelectCity] = useState("")
  const [selectProject, setSelectProject] = useState("")
  const [projectName, setProjectName] = useState([])
  const [price, setPrice] = useState("")
  const [type, setType] = useState("")
  const [companyAdress, setCompanyAddress] = useState("")

  const [phoneNo, setPhoneNo] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  const { text: facilitiesText, bullets: facilitiesBullets, handleBullets: facilitiesHandle } = useBullets();
  const { text: highlightText, bullets: highlightBullets, handleBullets: highlightHandle } = useBullets();
  const { text: amentisText, bullets: amentisBullets, handleBullets: amentisHandle } = useBullets();
  const { text: locationText, bullets: locationBullets, handleBullets: locationHandle } = useBullets();

  const { images, handleImage, setImages } = useMultiImage()
  const [galleryImages, setGalleryImages] = useState([]);
  const [floorDetail, setFloorDetail] = useState([{ image: null, preview: null, description: "" }])
  const [priceList, setPriceList] = useState([{ typology: "", size: "", price: "" }])

  const fetchCity = async () => {
    try {
      const response = await cityList()
      const result = response.data.data.city
      setCity(result)
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
        transition: Bounce,
      });
    }
  }

  useEffect(() => {
    fetchCity()
  }, [])

  const fetchAllProject = async () => {
    try {
      const response = await fetchProject()
      const result = response.data.data.project
      setProjectName(result)
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
        transition: Bounce,
      });
    }
  }

  useEffect(() => {
    fetchAllProject()
  }, [])

  const FloorImage = (index, e) => {
    const file = e.target.files[0]
    const newItems = [...floorDetail]
    newItems[index].image = file
    newItems[index].preview = URL.createObjectURL(file)
    setFloorDetail(newItems)
  }

  const FloorDescription = (index, e) => {
    const value = e.target.value
    const newItems = [...floorDetail]
    newItems[index].description = value
    setFloorDetail(newItems)
  }

  const addItems = () => {
    setFloorDetail([...floorDetail, { image: null, preview: null, description: "" }])
  }

  const handlePrice = (index, field, e) => {
    const items = [...priceList]
    items[index][field] = e.target.value;
    setPriceList(items)
  }

  const addPriceDetail = () => {
    setPriceList([...priceList, { typology: "", price: "", size: "" }])
  }

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    const previewFiles = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setGalleryImages(previewFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectCity || !selectProject || !companyAdress || !description || !type || !price || !phoneNo) {
      toast.error("Please fill all required fields", {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
        transition: Bounce,
      });
      return
    }
    setLoading(true)

    const formData = new FormData()

    formData.append("address", companyAdress)
    formData.append("cityId", selectCity)
    formData.append("projectId", selectProject)
    formData.append("about", description)
    formData.append("propertyType", type.toUpperCase())
    formData.append("phoneNum", phoneNo)
    formData.append("price", price)

    facilitiesBullets.forEach((facility, index) => {
      formData.append(`facilities[${index}]`, facility)
    })

    amentisBullets.forEach((item, index) => {
      formData.append(`amentiesDescription[${index}]`, item)
    })

    locationBullets.forEach((item, index) => {
      formData.append(`locationMapDescription[${index}]`, item)
    })

    highlightBullets.forEach((item, index) => {
      formData.append(`highlightDescription[${index}]`, item)
    })

    floorDetail.forEach((item, index) => {
      formData.append(`floors[${index}][areaName]`, item.description)
    })

    priceList.forEach((item, index) => {
      formData.append(`priceLists[${index}][typology]`, item.typology)
      formData.append(`priceLists[${index}][size]`, item.size)
      formData.append(`priceLists[${index}][price]`, item.price)
    })

    if (images.mainImage?.file) {
      formData.append("heroImage", images.mainImage.file)
    }

    if (images.amentis?.file) {
      formData.append("amenitiesImg", images.amentis.file)
    }

    if (images.location?.file) {
      formData.append("locationMapImg", images.location.file)
    }

    if (images.highlight?.file) {
      formData.append("highlightImg", images.highlight.file)
    }

    floorDetail.forEach((item) => {
      if (item.image) {
        formData.append(`floorImages`, item.image)
      }
    })

    galleryImages.forEach((img) => {
      formData.append("galleryImg", img.file)
    })

    if (images.companylogo?.file) {
      formData.append("companyLogo", images.companylogo.file)
    }

    try {
      const response = await addNewProject(formData)
      console.log("Success:", response)
      toast.success('property added successfully', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } catch (error) {
      console.error("Error:", error)
      toast.error(error.message || response.data?.data?.message, {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
        transition: Bounce,
      });
    }
    setLoading(false)
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-3xl font-semibold tracking-tight text-foreground">Property Admin Panel</h1>
          <p className="mt-2 text-sm text-muted-foreground">Add and manage property listings</p>
        </div>

        {/* Main Details Card */}
        <Card className="mb-6 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl sm:text-3xl font-semibold">Main Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Hero Image */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Hero Image <span className="text-muted-foreground font-normal">(1200 × 600px recommended)</span>
              </label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImage("mainImage")}
                className="mb-3"
              />

              <div className="rounded-lg overflow-hidden border border-border bg-muted/20">
                <img
                  src={images.mainImage?.preview}
                  className="h-[500px] w-full object-cover"
                  alt=""
                />
              </div>

            </div>

            {/* Property Type */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Property Type</label>
              <Select onValueChange={(value) => setType(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Company Name</label>
              <Select onValueChange={(value) => setSelectProject(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  {projectName.map((item, index) => (
                    <SelectItem key={index} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">City</label>
              <Select onValueChange={(value) => setSelectCity(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {city.map((item, index) => (
                    <SelectItem key={index} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Address</label>
              <Input
                type="text"
                value={companyAdress}
                onChange={(e) => setCompanyAddress(e.target.value)}
                placeholder="Enter address"
              />
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Features</label>
              <Textarea
                placeholder="Enter features (press Enter for new bullet point)"
                className="min-h-[100px] resize-y"
                value={facilitiesText}
                onChange={facilitiesHandle}
              />
            </div>

            {/* Price and Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Price</label>
                <Input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g., 1.2 Cr"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Phone Number</label>
                <Input
                  type="text"
                  value={phoneNo}
                  onChange={(e) => setPhoneNo(e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Detailed Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[160px] resize-y"
                placeholder="Enter detailed description"
              />
            </div>
          </CardContent>
        </Card>

        {/* Highlights Card */}
        <Card className="mb-6 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl sm:text-3xl font-semibold">Highlights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Highlight Image <span className="text-muted-foreground font-normal">(1200 × 600px recommended)</span>
              </label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImage("highlight")}
                className="mb-3"
              />
              {images.highlight?.preview && (
                <div className="rounded-lg overflow-hidden border border-border bg-muted/20">
                  <img
                    src={images.highlight.preview}
                    className=" aspect-[2/1] object-cover"
                    alt="Highlight preview"
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Highlight Features</label>
              <Textarea
                placeholder="Enter highlights (press Enter for new bullet point)"
                className="min-h-[100px] resize-y"
                value={highlightText}
                onChange={highlightHandle}
              />
            </div>
          </CardContent>
        </Card>

        {/* Amenities Card */}
        <Card className="mb-6 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl sm:text-3xl font-semibold">Amenities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Amenities Image <span className="text-muted-foreground font-normal">(1200 × 600px recommended)</span>
              </label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImage("amentis")}
                className="mb-3"
              />
              {images.amentis?.preview && (
                <div className="rounded-lg overflow-hidden border border-border bg-muted/20">
                  <img
                    src={images.amentis.preview}
                    className="w-full aspect-[2/1] object-cover"
                    alt="Amenities preview"
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Amenities Features</label>
              <Textarea
                placeholder="Enter amenities (press Enter for new bullet point)"
                className="min-h-[100px] resize-y"
                value={amentisText}
                onChange={amentisHandle}
              />
            </div>
          </CardContent>
        </Card>

        {/* Location Card */}
        <Card className="mb-6 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl sm:text-3xl font-semibold">Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Location Image <span className="text-muted-foreground font-normal">(1200 × 600px recommended)</span>
              </label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImage("location")}
                className="mb-3"
              />
              {images.location?.preview && (
                <div className="rounded-lg overflow-hidden border border-border bg-muted/20">
                  <img
                    src={images.location.preview}
                    className="w-full aspect-[2/1] object-cover"
                    alt="Location preview"
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Location Details</label>
              <Textarea
                placeholder="Enter location details (press Enter for new bullet point)"
                className="min-h-[100px] resize-y"
                value={locationText}
                onChange={locationHandle}
              />
            </div>
          </CardContent>
        </Card>

        {/* Floor Plans Card */}
        <Card className="mb-6 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl sm:text-3xl font-semibold">Floor Plans</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {floorDetail.map((item, index) => (
              <div key={index} className="p-4 rounded-lg border border-border bg-muted/20 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Floor Plan Image</label>
                  <Input
                    type="file"
                    onChange={(e) => FloorImage(index, e)}
                  />
                </div>
                {item.preview && (
                  <div className="rounded-lg overflow-hidden border border-border">
                    <img
                      src={item.preview}
                      className="w-full h-48 object-contain bg-white"
                      alt="Floor plan preview"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Floor Type</label>
                  <Input
                    type="text"
                    placeholder="e.g., 1 BHK"
                    value={item.description}
                    onChange={(e) => FloorDescription(index, e)}
                  />
                </div>
              </div>
            ))}
            <Button type="button" variant="" onClick={addItems} className="w-full sm:w-auto">
              Add More Floor
            </Button>
          </CardContent>
        </Card>

        {/* Price List Card */}
        <Card className="mb-6 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl sm:text-3xl font-semibold">Price List</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {priceList.map((item, index) => (
              <div key={index} className="p-4 rounded-lg border border-border bg-muted/20 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Typology</label>
                  <Input
                    type="text"
                    placeholder="e.g., 1 BHK, 2 BHK"
                    value={item.typology}
                    onChange={(e) => handlePrice(index, "typology", e)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Size (SQFT)</label>
                  <Input
                    type="text"
                    placeholder="e.g., 650 sqft"
                    value={item.size}
                    onChange={(e) => handlePrice(index, "size", e)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Price</label>
                  <Input
                    type="text"
                    placeholder="e.g., 45 Lakhs"
                    value={item.price}
                    onChange={(e) => handlePrice(index, "price", e)}
                  />
                </div>
              </div>
            ))}
            <Button type="button" variant="" onClick={addPriceDetail} className="w-full sm:w-auto">
              Add More Price Detail
            </Button>
          </CardContent>
        </Card>

        {/* Gallery Card */}
        <Card className="mb-6 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl sm:text-3xl font-semibold">Gallery</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Gallery Images (select multiple images)</label>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryChange}
              />
            </div>
            {galleryImages.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {galleryImages.map((img, index) => (
                  <div key={index} className="rounded-lg overflow-hidden border border-border">
                    <img
                      src={img.preview}
                      className="w-full h-40 sm:h-40 object-cover"
                      alt={`Gallery ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Company Logo Card */}


        {/* Submit Button */}
        {
          loading ? <div className="flex justify-end">
            <Button disabled className="px-6 py-3">
              <Spinner className="mr-2" />
              Submitting details
            </Button>
          </div> : <div className="flex justify-end">
            <Button
              type="submit"
              onClick={handleSubmit}
              className="w-full sm:w-auto px-8"
            >
              Submit Property
            </Button>
          </div>
        }

      </div>
    </div>
  );
}

export default AdminPannel;