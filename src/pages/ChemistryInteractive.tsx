import React from 'react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FlaskConical, Construction, ExternalLink } from 'lucide-react';

export default function ChemistryInteractive() {
  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <Card className="p-12">
            <CardContent className="space-y-6">
              <div className="w-24 h-24 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                <FlaskConical className="w-12 h-12 text-primary" />
              </div>
              
              <div>
                <Badge variant="secondary" className="mb-4">
                  <Construction className="w-3 h-3 mr-1" />
                  Coming Soon
                </Badge>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Chemistry Interactive Lab
                </h1>
                <p className="text-muted-foreground max-w-md mx-auto">
                  An interactive chemistry experience is being developed. 
                  Soon you'll be able to explore molecules, simulate reactions, 
                  and learn chemistry through hands-on virtual experiments.
                </p>
              </div>

              {/* Chemical Bonding Simulator Link */}
              <div className="pt-4">
                <Button asChild size="lg" className="gap-2">
                  <a href="/CHEMMMMMMMMMM3.html" target="_blank" rel="noopener noreferrer">
                    <FlaskConical className="w-5 h-5" />
                    Try Chemical Bonding Simulator
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>

              <div className="pt-6 border-t">
                <h3 className="font-medium text-foreground mb-3">Planned Features:</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• 3D Molecule Viewer</li>
                  <li>• Virtual Lab Experiments</li>
                  <li>• Chemical Reaction Simulations</li>
                  <li>• Interactive Periodic Table</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
}