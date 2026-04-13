'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Upload, FileText, Camera, CheckCircle, Clock, AlertCircle, Shield } from 'lucide-react'

const steps = [
  { id: 'id', label: 'Government ID', description: 'Passport, National ID, or Driver\'s License', icon: FileText },
  { id: 'address', label: 'Proof of Address', description: 'Utility bill or bank statement (last 3 months)', icon: FileText },
  { id: 'selfie', label: 'Selfie Verification', description: 'Take a photo of yourself holding your ID', icon: Camera },
]

export default function KycPage() {
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, boolean>>({})
  const [kycStatus] = useState<'NOT_STARTED' | 'PENDING' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED'>('NOT_STARTED')

  const handleUpload = (docType: string) => {
    setUploadedDocs(prev => ({ ...prev, [docType]: true }))
  }

  if (kycStatus === 'APPROVED') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Identity Verified</h2>
            <p className="text-gray-600">Your identity has been verified. You have full access to all features.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (kycStatus === 'IN_REVIEW' || kycStatus === 'PENDING') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification In Progress</h2>
            <p className="text-gray-600 mb-4">Your documents are being reviewed. This usually takes 1-2 business days.</p>
            <Badge variant="warning">Under Review</Badge>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Verify Your Identity</h1>
        <p className="text-gray-600 mt-1">
          Complete identity verification to unlock full transfer limits and features.
        </p>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4 flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">Your data is secure</p>
            <p>All documents are encrypted and stored securely. We comply with international data protection regulations.</p>
          </div>
        </CardContent>
      </Card>

      {steps.map((step, index) => (
        <Card key={step.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  uploadedDocs[step.id] ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  {uploadedDocs[step.id] ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <step.icon className="w-5 h-5 text-gray-500" />
                  )}
                </div>
                <div>
                  <CardTitle className="text-base">Step {index + 1}: {step.label}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </div>
              </div>
              {uploadedDocs[step.id] && <Badge variant="success">Uploaded</Badge>}
            </div>
          </CardHeader>
          <CardContent>
            {!uploadedDocs[step.id] ? (
              <div
                onClick={() => handleUpload(step.id)}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
              >
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG or PDF up to 10MB</p>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <FileText className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-800">Document uploaded successfully</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      <Button
        size="lg"
        className="w-full"
        disabled={Object.keys(uploadedDocs).length < 3}
      >
        {Object.keys(uploadedDocs).length < 3
          ? `Upload ${3 - Object.keys(uploadedDocs).length} more document(s)`
          : 'Submit for Verification'
        }
      </Button>
    </div>
  )
}
